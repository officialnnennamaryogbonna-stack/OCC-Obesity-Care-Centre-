import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, FitnessLevel, DietaryPreference, HealthGoal } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Heart, Target, Activity, User, Settings } from 'lucide-react';

import Logo from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const STEPS = [
  { id: 'splash', title: 'OCC', icon: Logo },
  { id: 'welcome_intro', title: 'Welcome to Obesity Care Centre', icon: User },
  { id: 'basics', title: 'The Basics', icon: User },
  { id: 'lifestyle', title: 'Your Lifestyle', icon: Activity },
  { id: 'goals', title: 'Your Goals', icon: Target },
  { id: 'reminders', title: 'Stay on Track', icon: Settings },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
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
  });

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete({ ...profile, onboarded: true });
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Splash Screen (Sketch 1)
        return (
          <div 
            onClick={nextStep}
            className="text-center space-y-8 flex flex-col items-center justify-center min-h-[70vh] cursor-pointer"
          >
            <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-xl shadow-blue-100 p-6">
              <Logo className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">OCC</h2>
              <h3 className="text-xl font-bold text-gray-700">Obesity Care Centre</h3>
              <p className="text-blue-600 font-medium italic">Eat smart, move well, feel great.</p>
            </div>
            <div className="flex space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
            <p className="text-gray-300 text-xs animate-pulse">Tap to continue</p>
            <div className="absolute bottom-12 right-0 text-gray-400 text-sm font-medium italic">
              made by TWIN
            </div>
          </div>
        );
      case 1: // Welcome Intro (Sketch 2)
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Obesity Care Centre</h2>
              <p className="text-gray-500">Helping you to lead a healthier life.</p>
            </div>
            
            <div className="relative w-64 h-64 mx-auto">
              {/* Central Illustration Concept */}
              <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-32 h-32 text-blue-200" />
              </div>
              
              {/* Floating Icons from Sketch */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-0 left-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl"
              >
                🍎
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-10 right-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl"
              >
                👟
              </motion.div>
              <motion.div 
                animate={{ x: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute bottom-10 left-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl"
              >
                📝
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-0 right-10 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl"
              >
                ❤️
              </motion.div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <button onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200">
                Get Started
              </button>
              <button className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold border border-gray-100">
                Learn More
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => updateProfile({ name: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={e => updateProfile({ age: parseInt(e.target.value) })}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={e => updateProfile({ gender: e.target.value as Gender })}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={e => updateProfile({ height: parseInt(e.target.value) })}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={e => updateProfile({ weight: parseInt(e.target.value) })}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Your Lifestyle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                <select
                  value={profile.activityLevel}
                  onChange={e => updateProfile({ activityLevel: e.target.value as ActivityLevel })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="sedentary">Sedentary (Office job, little exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (Physical job, heavy exercise)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                <select
                  value={profile.fitnessLevel}
                  onChange={e => updateProfile({ fitnessLevel: e.target.value as FitnessLevel })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                <select
                  value={profile.dietaryPreference}
                  onChange={e => updateProfile({ dietaryPreference: e.target.value as DietaryPreference })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="none">No specific preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="high-protein">High Protein</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">What's your main goal?</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'habits', label: 'Build healthier eating habits', icon: '🥗' },
                { id: 'activity', label: 'Increase physical activity', icon: '🏃' },
                { id: 'consistency', label: 'Improve consistency', icon: '📅' },
                { id: 'weight-loss', label: 'Gradually manage weight', icon: '⚖️' },
                { id: 'maintain', label: 'Maintain current weight', icon: '💪' },
              ].map(goal => (
                <button
                  key={goal.id}
                  onClick={() => updateProfile({ mainGoal: goal.id as HealthGoal })}
                  className={`flex items-center p-4 rounded-xl border transition-all ${
                    profile.mainGoal === goal.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl mr-4">{goal.icon}</span>
                  <span className="font-medium">{goal.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Reminder Preferences</h3>
            <div className="space-y-3">
              {[
                { id: 'water', label: 'Drink Water', icon: '💧' },
                { id: 'meals', label: 'Eat on Time', icon: '🍽️' },
                { id: 'exercise', label: 'Exercise', icon: '👟' },
                { id: 'sleep', label: 'Sleep', icon: '🌙' },
                { id: 'checkins', label: 'Healthy Check-ins', icon: '✅' },
              ].map(rem => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{rem.icon}</span>
                    <span className="font-medium text-gray-700">{rem.label}</span>
                  </div>
                  <button
                    onClick={() =>
                      updateProfile({
                        reminderPreferences: {
                          ...profile.reminderPreferences,
                          [rem.id]: !profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences],
                        },
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences]
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences]
                          ? 'left-7'
                          : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="flex space-x-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-8 bg-blue-600' : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button onClick={prevStep} className={`p-2 text-gray-400 ${step === 0 ? 'invisible' : ''}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 max-w-md mx-auto w-full">
        {step > 1 && (
          <button
            onClick={nextStep}
            disabled={step === 2 && !profile.name}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
