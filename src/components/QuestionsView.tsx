import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
}

interface TestHistoryEntry {
  id: number;
  date: string;
  questions: Question[];
  userAnswers: Record<number, number>;
  score: number;
  total: number;
}

type ViewState = 'SETUP' | 'TAKING_TEST' | 'SCORE_CARD' | 'REVIEWING';

interface QuestionsViewProps {
  onStateChange?: (state: ViewState, currentQ?: number, totalQ?: number) => void;
}

export default function QuestionsView({ onStateChange }: QuestionsViewProps) {
  const [textInput, setTextInput] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [viewState, setViewState] = useState<ViewState>('SETUP');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [testHistory, setTestHistory] = useState<TestHistoryEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(viewState, currentQIndex, questions.length);
  }, [viewState, currentQIndex, questions.length]);

  useEffect(() => {
    const saved = localStorage.getItem('flowstate_test_history');
    if (saved) {
      try { setTestHistory(JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
  }, []);

  const saveHistory = (entry: TestHistoryEntry) => {
    const updated = [entry, ...testHistory];
    setTestHistory(updated);
    localStorage.setItem('flowstate_test_history', JSON.stringify(updated));
  };

  const deleteHistoryEntry = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = testHistory.filter(t => t.id !== id);
    setTestHistory(updated);
    localStorage.setItem('flowstate_test_history', JSON.stringify(updated));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrorMsg('');
    try {
      let combinedText = textInput;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== 'application/pdf') continue;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let pdfText = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          pdfText += textContent.items.map((item: any) => item.str).join(' ') + ' ';
        }
        combinedText += '\n\n' + pdfText;
      }
      setTextInput(combinedText);
    } catch (err: any) {
      setErrorMsg('Error reading PDF: ' + err.message);
    }
  };

  const startTest = async () => {
    if (!textInput.trim()) {
      setErrorMsg('Please add some text or upload a PDF first.');
      return;
    }
    const openaiKey = localStorage.getItem('openai_api_key');
    const deepseekKey = localStorage.getItem('deepseek_api_key');
    if (!openaiKey && !deepseekKey) {
      setErrorMsg('Please add an OpenAI or DeepSeek API key in Settings (gear icon).');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setQuestions([]);
    setUserAnswers({});
    setCurrentQIndex(0);

    const apiKey = (openaiKey || deepseekKey)!;
    const isDeepSeek = !openaiKey && !!deepseekKey;
    const baseUrl = isDeepSeek ? 'https://api.deepseek.com/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    const model = isDeepSeek ? 'deepseek-chat' : 'gpt-4o-mini';

    const maxChars = 60000;
    let safeText = textInput;
    if (safeText.length > maxChars) safeText = safeText.slice(0, maxChars) + '... [truncated]';

    const prompt = `You are an SSC CGL Mains exam question paper setter. Generate exactly ${numQuestions} multiple-choice questions at the SSC CGL (Combined Graduate Level) Mains difficulty level, based strictly on the provided study material.

Question Style — follow these rules strictly:
- PRIMARILY use fill-in-the-blank format with real sentences. Example for Articles: "Select the correct option to fill in the blank: '______ Ganga is the longest river in India.'" with options like (a) A (b) An (c) The (d) No article.
- For grammar topics (articles, prepositions, tenses, voice, narration, subject-verb agreement, etc.), create practical sentence-based questions where the student must pick the correct word/phrase to complete the sentence — exactly like SSC CGL Mains English section.
- For non-grammar/conceptual topics, ask direct application-based questions that test whether the student can apply the concept, not just recall definitions.
- Do NOT ask theoretical "What is the definition of..." style questions. Test application and usage.
- Do NOT wrap questions in fake scenarios or role-play ("A student is...", "A teacher wants to..."). Just give the sentence or question directly.
- Each question must have exactly 4 options with only ONE correct answer.
- Wrong options must be plausible — they should reflect common mistakes that SSC aspirants actually make (e.g., confusing "a" vs "an", wrong preposition, incorrect tense).
- Vary the question patterns: fill in the blank, spot the error, choose the correct sentence, etc. — all matching SSC CGL Mains style.
- All questions MUST be based on the concepts from the provided study material only.

Return ONLY a JSON array. No markdown, no backticks, no explanation.
[
  {
    "question": "Fill in the blank: 'He has been living in ______ United States for five years.'",
    "options": ["a", "an", "the", "no article"],
    "answerIndex": 2
  }
]

Study Material:
${safeText}`;

    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: Math.min(4000, numQuestions * 200) })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API Error: ${res.status}`);
      }
      const data = await res.json();
      let content = data.choices[0].message.content.trim();
      if (content.startsWith('```json')) content = content.slice(7);
      if (content.startsWith('```')) content = content.slice(3);
      if (content.endsWith('```')) content = content.slice(0, -3);
      content = content.trim();
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid response format');
      setQuestions(parsed);
      setViewState('TAKING_TEST');
    } catch (err: any) {
      setErrorMsg('Failed to generate: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionClick = (optIndex: number) => {
    if (viewState !== 'TAKING_TEST') return;
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
  };

  const submitTest = () => {
    const score = Object.keys(userAnswers).reduce((acc, qi) => {
      return questions[Number(qi)]?.answerIndex === userAnswers[Number(qi)] ? acc + 1 : acc;
    }, 0);
    saveHistory({ id: Date.now(), date: new Date().toLocaleString(), questions, userAnswers, score, total: questions.length });
    setViewState('SCORE_CARD');
  };

  const loadPastTest = (test: TestHistoryEntry) => {
    setQuestions(test.questions);
    setUserAnswers(test.userAnswers);
    setViewState('SCORE_CARD');
  };

  const resetSetup = () => {
    setQuestions([]);
    setUserAnswers({});
    setCurrentQIndex(0);
    setViewState('SETUP');
  };

  const score = Object.keys(userAnswers).reduce((acc, qi) => {
    return questions[Number(qi)]?.answerIndex === userAnswers[Number(qi)] ? acc + 1 : acc;
  }, 0);

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const ringColor = pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444';
  const CIRCUMFERENCE = 2 * Math.PI * 54;
  const ringOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  // --- SETUP VIEW ---
  if (viewState === 'SETUP' && !isGenerating) {
    return (
      <div className="hide-scrollbar" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff', width: '100%', overflowY: 'auto', height: '100%' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Test Your Knowledge</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Generate SSC CGL Mains-level questions from your study material.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '30px' }}>
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Paste your study notes, concepts, or any text here..."
            style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '16px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', outline: 'none', lineHeight: '1.6' }}
          />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload PDF(s)
            </button>
            <input type="file" multiple accept="application/pdf" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePdfUpload} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Questions:</span>
              <select
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {textInput.trim() && (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginBottom: '16px' }}>
              {textInput.length.toLocaleString()} characters · ~{Math.ceil(textInput.length / 4).toLocaleString()} tokens
            </div>
          )}

          {errorMsg && <div style={{ color: '#f87171', marginBottom: '16px', fontSize: '14px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>{errorMsg}</div>}

          <button
            onClick={startTest}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '13px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, width: '100%', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
          >
            Generate & Start Test
          </button>
        </div>

        {testHistory.length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Past Tests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {testHistory.map(test => {
                const testPct = Math.round((test.score / test.total) * 100);
                const col = testPct >= 70 ? '#4ade80' : testPct >= 40 ? '#facc15' : '#f87171';
                return (
                  <div
                    key={test.id}
                    onClick={() => loadPastTest(test)}
                    style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  >
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '14px' }}>{test.date}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{test.total} questions · {testPct}%</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: col, fontWeight: 700, fontSize: '16px' }}>{test.score}/{test.total}</div>
                      <button
                        onClick={(e) => deleteHistoryEntry(test.id, e)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- GENERATING ---
  if (isGenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Crafting SSC CGL Mains-level questions...</p>
      </div>
    );
  }

  // --- TAKING TEST / REVIEWING ---
  if (viewState === 'TAKING_TEST' || viewState === 'REVIEWING') {
    const q = questions[currentQIndex];
    const isReview = viewState === 'REVIEWING';
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto', color: '#fff', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: isReview ? ringColor : '#3b82f6', borderRadius: '2px', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Question {currentQIndex + 1} of {questions.length}{isReview ? ' · Review Mode' : ''}</span>
            {!isReview && <span>{Object.keys(userAnswers).length} answered</span>}
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 500, lineHeight: 1.5, marginBottom: '28px' }}>{q.question}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            {q.options.map((opt, oi) => {
              const isSelected = userAnswers[currentQIndex] === oi;
              const isCorrect = q.answerIndex === oi;
              const isWrongPick = isSelected && !isCorrect;

              let bg = 'rgba(255,255,255,0.04)';
              let border = '1px solid rgba(255,255,255,0.08)';
              let textCol = '#fff';

              if (isReview) {
                if (isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '2px solid #22c55e'; }
                else if (isWrongPick) { bg = 'rgba(239,68,68,0.12)'; border = '2px solid #ef4444'; }
              } else if (isSelected) {
                bg = 'rgba(59,130,246,0.12)'; border = '2px solid #3b82f6';
              }

              return (
                <div
                  key={oi}
                  onClick={() => handleOptionClick(oi)}
                  style={{ padding: '14px 18px', borderRadius: '10px', background: bg, border, color: textCol, cursor: isReview ? 'default' : 'pointer', transition: 'all 0.2s', fontSize: '15px', lineHeight: 1.4 }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '10px', fontWeight: 600 }}>{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px' }}>
          <button
            onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))}
            disabled={currentQIndex === 0}
            style={{ background: currentQIndex === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)', color: currentQIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 22px', borderRadius: '8px', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '14px' }}
          >
            ← Previous
          </button>

          {currentQIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQIndex(p => Math.min(questions.length - 1, p + 1))}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              Next →
            </button>
          ) : isReview ? (
            <button
              onClick={() => setViewState('SCORE_CARD')}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              Finish Review
            </button>
          ) : (
            <button
              onClick={submitTest}
              disabled={Object.keys(userAnswers).length < questions.length}
              style={{ background: Object.keys(userAnswers).length < questions.length ? 'rgba(255,255,255,0.06)' : '#22c55e', color: Object.keys(userAnswers).length < questions.length ? 'rgba(255,255,255,0.3)' : '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: Object.keys(userAnswers).length < questions.length ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- SCORE CARD ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', color: '#fff' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '24px' }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle cx="70" cy="70" r="54" fill="none" stroke={ringColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={ringOffset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: '32px', fontWeight: 700 }}>{pct}%</span>
        </div>
      </div>

      <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>{score} / {questions.length} correct</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '30px' }}>
        {pct >= 70 ? 'Great job! You know your stuff.' : pct >= 40 ? 'Not bad, but room to improve.' : 'Keep studying, you\'ll get there!'}
      </p>

      <div style={{ display: 'flex', gap: '14px' }}>
        <button
          onClick={() => { setCurrentQIndex(0); setViewState('REVIEWING'); }}
          style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
        >
          Review Answers
        </button>
        <button
          onClick={resetSetup}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          New Test
        </button>
      </div>
    </div>
  );
}
