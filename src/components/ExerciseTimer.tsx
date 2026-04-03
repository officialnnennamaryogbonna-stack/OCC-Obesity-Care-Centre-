import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
}

export default function ExerciseTimer({ duration, onComplete }: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      if (onComplete) onComplete();
      // Play a simple notification sound if needed
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
      } catch (e) {
        console.log("Audio playback failed", e);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center space-y-3">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            className="stroke-gray-200 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r="44"
            className={cn(
              "fill-none transition-all duration-1000",
              isCompleted ? "stroke-green-500" : "stroke-blue-600"
            )}
            strokeWidth="8"
            strokeDasharray={276}
            strokeDashoffset={276 - (276 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isCompleted ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <span className="text-xl font-bold text-gray-900">{formatTime(timeLeft)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          disabled={isCompleted}
          className={cn(
            "p-2 rounded-full transition-colors",
            isActive ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600",
            isCompleted && "opacity-50 cursor-not-allowed"
          )}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {isCompleted && (
        <p className="text-xs font-bold text-green-600 animate-bounce">Great job! Time's up!</p>
      )}
    </div>
  );
}
