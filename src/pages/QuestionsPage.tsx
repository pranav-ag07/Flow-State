import { useState } from 'react';
import QuestionsView from '../components/QuestionsView';

export default function QuestionsPage() {
  const [qState, setQState] = useState<{ state: string; current: number; total: number }>({ state: 'SETUP', current: 0, total: 0 });

  const getStatusLabel = () => {
    switch (qState.state) {
      case 'TAKING_TEST': return `Question ${qState.current + 1} of ${qState.total}`;
      case 'REVIEWING': return `Reviewing ${qState.current + 1} of ${qState.total}`;
      case 'SCORE_CARD': return 'Results';
      default: return 'Create a Test';
    }
  };

  return (
    <>
      <header className="top-nav">
        <div className="brand">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          Flow State
        </div>

        <div className="nav-controls">
          <div className="page-indicator" style={{ padding: '0 8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>{getStatusLabel()}</span>
          </div>
        </div>

        <div className="view-toggles">
          {qState.state === 'TAKING_TEST' && qState.total > 0 && (
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', padding: '8px 16px' }}>
              {Math.round(((qState.current + 1) / qState.total) * 100)}% complete
            </span>
          )}
        </div>
      </header>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <QuestionsView onStateChange={(state, current, total) => setQState({ state, current: current ?? 0, total: total ?? 0 })} />
      </div>
    </>
  );
}
