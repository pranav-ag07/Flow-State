import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  syllabusDate: Date;
  startDate?: Date; // To calculate progress %
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, total: diff };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function CountdownTimer({ targetDate, syllabusDate, startDate = new Date('2024-01-01') }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate));
  const [sylTime, setSylTime] = useState(() => getTimeLeft(syllabusDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(targetDate));
      setSylTime(getTimeLeft(syllabusDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, syllabusDate]);

  // Calculate percentage for progress ring
  const totalDuration = targetDate.getTime() - startDate.getTime();
  const elapsed = new Date().getTime() - startDate.getTime();
  const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  // Determine color based on remaining days
  let colorClass = 'from-blue-400 to-white';
  let ringColor = 'text-blue-500';
  
  if (time.days <= 10) {
    colorClass = 'from-red-400 to-red-100';
    ringColor = 'text-red-500';
  } else if (time.days <= 30) {
    colorClass = 'from-amber-400 to-amber-100';
    ringColor = 'text-amber-500';
  }

  // Ring circumference
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex-1 w-full bg-transparent font-sans text-white">
      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4">
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center animate-fade-slide-up shrink-0">
        
        {/* Main Days Counter */}
        <div className="relative mb-14 group">
          <svg className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] -rotate-90 transform drop-shadow-2xl">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-in-out ${ringColor}`}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.08)] group-hover:scale-[1.02] transition-all duration-500">
            <span className={`text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${colorClass} animate-pulse drop-shadow-lg tabular-nums`}>
              {time.days}
            </span>
            <span className="text-[#888] tracking-[0.2em] mt-2 text-sm font-medium">
              DAYS LEFT
            </span>
          </div>
        </div>

        {/* Hours / Minutes / Seconds Row */}
        <div className="flex items-start gap-4 mb-16">
          <TimeUnit value={time.hours} label="HOURS" />
          <span className="text-4xl text-white/50 animate-pulse mt-8">:</span>
          <TimeUnit value={time.minutes} label="MINUTES" />
          <span className="text-4xl text-white/50 animate-pulse mt-8">:</span>
          <TimeUnit value={time.seconds} label="SECONDS" />
        </div>

        {/* Goal Section */}
        <div className="w-full flex flex-col items-center bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors duration-300 shadow-xl group shrink-0">
          <h3 className="text-sm tracking-widest text-white/70 uppercase mb-6 relative inline-block shrink-0">
            Complete Syllabus in ..
            <span className="absolute -bottom-3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-500" />
          </h3>
          <div className="flex items-center gap-3 text-lg font-light text-white/90 shrink-0 tabular-nums">
            <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-medium shadow-inner">
              {sylTime.days}<span className="text-white/40 text-sm ml-1.5">d</span>
            </span>
            <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-medium shadow-inner">
              {pad(sylTime.hours)}<span className="text-white/40 text-sm ml-1.5">h</span>
            </span>
            <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-medium shadow-inner">
              {pad(sylTime.minutes)}<span className="text-white/40 text-sm ml-1.5">m</span>
            </span>
            <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-medium shadow-inner">
              {pad(sylTime.seconds)}<span className="text-white/40 text-sm ml-1.5">s</span>
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-24 h-28 flex items-center justify-center shadow-lg group hover:scale-[1.03] hover:bg-white/10 transition-all duration-300 relative overflow-hidden shrink-0">
        <span className="text-5xl font-semibold text-white/90 tabular-nums">
          {pad(value)}
        </span>
        {/* Subtle inner reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
      </div>
      <span className="text-[#888] text-[11px] tracking-[0.25em] mt-4 font-medium">
        {label}
      </span>
    </div>
  );
}
