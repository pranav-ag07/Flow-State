import { useState, useEffect } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [openAiKey, setOpenAiKey] = useState('');
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const savedOpenAi = localStorage.getItem('openai_api_key');
    const savedDeepSeek = localStorage.getItem('deepseek_api_key');
    if (savedOpenAi) setOpenAiKey(savedOpenAi);
    if (savedDeepSeek) setDeepSeekKey(savedDeepSeek);
  }, []);

  const handleSave = () => {
    localStorage.setItem('openai_api_key', openAiKey);
    localStorage.setItem('deepseek_api_key', deepSeekKey);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="zoom-modal open" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.6)' }}>
      <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Settings</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>OpenAI API Key</label>
          <input 
            type="password" 
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
            placeholder="sk-..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>DeepSeek API Key</label>
          <input 
            type="password" 
            value={deepSeekKey}
            onChange={(e) => setDeepSeekKey(e.target.value)}
            placeholder="sk-..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#4ade80', fontSize: '14px', opacity: savedMessage ? 1 : 0, transition: 'opacity 0.3s' }}>Saved successfully!</span>
          <button 
            onClick={handleSave}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}
