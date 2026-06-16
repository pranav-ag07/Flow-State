import { useState, useEffect, useRef } from 'react';

export default function FocusTimer() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [currentSeconds, setCurrentSeconds] = useState(25 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const playBeep = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const beep = (freq: number, time: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    beep(659.25, ctx.currentTime, 1.0); // E5
    beep(880.00, ctx.currentTime + 0.3, 1.5); // A5
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setIsFlashing(true);
            playBeep();
            setTimeout(() => setIsFlashing(false), 6000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setIsFlashing(false);
    setCurrentSeconds(totalSeconds);
  };

  const adjustTime = (delta: number) => {
    if (isPlaying) return;
    const newTotal = Math.max(5 * 60, totalSeconds + delta);
    setTotalSeconds(newTotal);
    setCurrentSeconds(newTotal);
  };

  const fraction = totalSeconds > 0 ? currentSeconds / totalSeconds : 0;

  // Outer widget circle
  const WIDGET_CIRCUMFERENCE = 2 * Math.PI * 60;
  const widgetOffset = WIDGET_CIRCUMFERENCE - (fraction * WIDGET_CIRCUMFERENCE);

  // Icon circle (r=10)
  const ICON_CIRCUMFERENCE = 2 * Math.PI * 10;
  const iconOffset = ICON_CIRCUMFERENCE - (fraction * ICON_CIRCUMFERENCE);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="icon-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Focus Timer"
      >
        <svg className="feather" viewBox="0 0 24 24" style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Background clock circle */}
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)"></circle>
          {/* Progress clock circle */}
          <circle 
            cx="12" cy="12" r="10" 
            stroke="#ffffff" 
            strokeDasharray={ICON_CIRCUMFERENCE}
            strokeDashoffset={isNaN(iconOffset) ? 0 : iconOffset}
            style={{ transition: 'stroke-dashoffset 1s linear', transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          ></circle>
          {/* Clock hands */}
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={`timer-widget ${isFlashing ? 'flashing' : ''}`}>
          <div className="timer-header">Focus Timer</div>
          
          <div className="timer-ring-container">
            <svg className="timer-svg" viewBox="0 0 132 132">
              <circle className="timer-bg" cx="66" cy="66" r="60"></circle>
              <circle 
                className="timer-progress" 
                cx="66" cy="66" r="60"
                stroke="#ffffff"
                style={{ strokeDasharray: WIDGET_CIRCUMFERENCE, strokeDashoffset: isNaN(widgetOffset) ? 0 : widgetOffset }}
              ></circle>
            </svg>
            <div className="timer-display">{formatTime(currentSeconds)}</div>
          </div>

          <div className="timer-controls">
            <button className="timer-btn-small" onClick={() => adjustTime(-5 * 60)}>−</button>
            <button className="timer-btn-small" onClick={() => adjustTime(5 * 60)}>+</button>
          </div>

          <div className="timer-actions">
            <button className="timer-btn" onClick={handleReset}>Reset</button>
            <button className="timer-btn primary" onClick={() => {
              setIsFlashing(false);
              if (currentSeconds > 0) setIsPlaying(!isPlaying);
            }}>
              {isPlaying ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
