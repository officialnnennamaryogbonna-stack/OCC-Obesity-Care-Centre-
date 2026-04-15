import React, { useState } from 'react';
import { MOCK_WORKOUTS } from '../constants';
import { Workout, FitnessLevel, DailyLog, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, Flame, ChevronRight, X, Dumbbell, Timer, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import ExerciseTimer from './ExerciseTimer';
import confetti from 'canvas-confetti';

import Gyms from './Gyms';

interface FitnessProps {
  onUpdateLog?: (updates: Partial<DailyLog>) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  dailyLog?: DailyLog;
  profile: UserProfile;
}

export default function Fitness({ onUpdateLog, onUpdateProfile, dailyLog, profile }: FitnessProps) {
  const [activeTab, setActiveTab] = useState<'workouts' | 'gyms'>('workouts');
  const [level, setLevel] = useState<FitnessLevel>(profile.fitnessLevel);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredWorkouts = [...MOCK_WORKOUTS]
    .filter(w => w.difficulty === level)
    .sort((a, b) => {
      const isARecommended = (profile.mainGoal === 'activity' && a.duration > 30) ||
                             (profile.mainGoal === 'weight-loss' && a.caloriesBurned >= 200);
      const isBRecommended = (profile.mainGoal === 'activity' && b.duration > 30) ||
                             (profile.mainGoal === 'weight-loss' && b.caloriesBurned >= 200);
      
      if (isARecommended && !isBRecommended) return -1;
      if (!isARecommended && isBRecommended) return 1;
      return 0;
    });

  const handleCompleteWorkout = (workout: Workout) => {
    if (onUpdateLog && dailyLog) {
      onUpdateLog({
        caloriesBurned: dailyLog.caloriesBurned + workout.caloriesBurned,
        workoutCompleted: true
      });
    }
    
    onUpdateProfile({ points: profile.points + 50 });

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#fbbf24', '#10b981']
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedWorkout(null);
    }, 1500);
  };

  const levels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="pb-32 pt-6 px-4 sm:px-6 space-y-6 max-w-lg mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Hub</h1>
          <p className="text-gray-500 text-sm">Move your body, feel the energy.</p>
        </div>
      </header>

      {/* Top Tabs */}
      <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('workouts')}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'workouts' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Workouts</span>
        </button>
        <button
          onClick={() => setActiveTab('gyms')}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'gyms' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <MapPin className="w-4 h-4" />
          <span>Gym Centers</span>
        </button>
      </div>

      {activeTab === 'workouts' ? (
        <div className="space-y-6">
          {/* Fitness Level Selector */}
          <div className="flex space-x-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {levels.map(l => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id as FitnessLevel)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                  level === l.id ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Workout List */}
          <div className="space-y-4">
            {filteredWorkouts.map(workout => {
              const isRecommended = (profile.mainGoal === 'activity' && workout.duration > 30) ||
                                   (profile.mainGoal === 'weight-loss' && workout.caloriesBurned >= 200);

              return (
                <motion.div
                  key={workout.id}
                  layoutId={workout.id}
                  onClick={() => {
                    setSelectedWorkout(workout);
                    setActiveExerciseIndex(null);
                  }}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:border-blue-200 transition-colors relative overflow-hidden"
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl flex items-center">
                      <Sparkles className="w-2 h-2 mr-1" />
                      RECOMMENDED
                    </div>
                  )}
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Dumbbell className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{workout.title}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {workout.duration} min</span>
                      <span className="flex items-center"><Flame className="w-3 h-3 mr-1" /> {workout.caloriesBurned} kcal</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <Gyms />
      )}

      {/* Workout Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWorkout(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              layoutId={selectedWorkout.id}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] max-h-[90vh] overflow-y-auto"
            >
              {/* Workout Image */}
              <div className="relative h-48 sm:h-64 w-full">
                <img 
                  src={selectedWorkout.image || `https://picsum.photos/seed/${selectedWorkout.id}/800/600`} 
                  alt={selectedWorkout.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={() => setSelectedWorkout(null)} 
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-8 right-8">
                  <h2 className="text-2xl font-bold text-white">{selectedWorkout.title}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-blue-200 font-bold text-sm">{selectedWorkout.duration} mins</span>
                    <span className="text-white/40">•</span>
                    <span className="text-orange-300 font-bold text-sm">{selectedWorkout.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Play className="w-4 h-4 mr-2 text-blue-600 fill-blue-600" />
                    How to perform this workout
                  </h4>
                  <div className="space-y-4">
                    {selectedWorkout.instructions.map((step, i) => (
                      <div key={i} className="space-y-4">
                        <div 
                          className={cn(
                            "p-4 rounded-2xl border transition-all",
                            activeExerciseIndex === i ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-transparent"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                                activeExerciseIndex === i ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                              )}>
                                {i + 1}
                              </div>
                              <p className="text-sm text-gray-600 pt-1.5">{step}</p>
                            </div>
                            <button
                              onClick={() => setActiveExerciseIndex(activeExerciseIndex === i ? null : i)}
                              className={cn(
                                "p-2 rounded-xl transition-colors",
                                activeExerciseIndex === i ? "bg-blue-600 text-white" : "bg-white border border-gray-100 text-gray-400"
                              )}
                            >
                              <Timer className="w-5 h-5" />
                            </button>
                          </div>

                          {activeExerciseIndex === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-4 overflow-hidden"
                            >
                              <ExerciseTimer 
                                duration={60} 
                                onComplete={() => {
                                  if (i < selectedWorkout.instructions.length - 1) {
                                    // Optional: auto-advance
                                  }
                                }} 
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleCompleteWorkout(selectedWorkout)}
                  disabled={showSuccess}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2",
                    showSuccess ? "bg-green-500 text-white shadow-green-100" : "bg-blue-600 text-white shadow-blue-200"
                  )}
                >
                  {showSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Workout Completed!</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>Complete Workout</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
