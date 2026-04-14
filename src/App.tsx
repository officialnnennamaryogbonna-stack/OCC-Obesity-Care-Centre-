import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Meals from './components/Meals';
import Fitness from './components/Fitness';
import Support from './components/Support';
import Profile from './components/Profile';
import { motion, AnimatePresence } from 'motion/react';

import Logo from './components/Logo';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  age: 25,
  height: 170,
  weight: 80,
  gender: 'male',
  activityLevel: 'moderate',
  fitnessLevel: 'beginner',
  dietaryPreference: 'none',
  mainGoal: 'habits',
  reminderPreferences: {
    water: true,
    meals: true,
    exercise: true,
    sleep: true,
    checkins: true,
  },
  points: 0,
  badges: [],
  onboarded: false,
  offlineMode: false,
};

const INITIAL_LOG: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  weight: 80,
  waterIntake: 0,
  caloriesConsumed: 0,
  caloriesBurned: 0,
  steps: 0,
  workoutCompleted: false,
  mealsLogged: [],
  habits: {},
};

export default function App() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('occ_profile', INITIAL_PROFILE);
  const [dailyLog, setDailyLog] = useLocalStorage<DailyLog>('occ_daily_log', INITIAL_LOG);
  const [activeTab, setActiveTab] = useState('home');
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsAppReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center text-white p-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mb-6 p-4"
        >
          <Logo className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Obesity Care Centre</h1>
        <p className="text-blue-100 text-center max-w-xs">Your supportive partner for a healthier lifestyle.</p>
        <div className="mt-12 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (!profile.onboarded) {
    return <Onboarding onComplete={setProfile} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home profile={profile} dailyLog={dailyLog} onUpdateLog={updates => setDailyLog(prev => ({ ...prev, ...updates }))} onTabChange={setActiveTab} />;
      case 'meals':
        return <Meals 
          onUpdateLog={updates => setDailyLog(prev => ({ ...prev, ...updates }))} 
          dailyLog={dailyLog}
          profile={profile}
        />;
      case 'fitness':
        return <Fitness 
          onUpdateLog={updates => setDailyLog(prev => ({ ...prev, ...updates }))} 
          dailyLog={dailyLog}
          profile={profile}
        />;
      case 'support':
        return <Support profile={profile} />;
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={updates => setProfile(prev => ({ ...prev, ...updates }))} />;
      default:
        return <Home 
          profile={profile} 
          dailyLog={dailyLog} 
          onUpdateLog={updates => setDailyLog(prev => ({ ...prev, ...updates }))} 
          onTabChange={setActiveTab} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
