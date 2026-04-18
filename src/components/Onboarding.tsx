import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, FitnessLevel, DietaryPreference, HealthGoal } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Heart, Target, Activity, User, Settings } from 'lucide-react';

import Logo from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  profile: UserProfile;
}

const STEPS = [
  { id: 'splash', title: 'OCC', icon: Logo },
  { id: 'intro1', title: 'Eat Smart', icon: Logo },
  { id: 'intro2', title: 'Move Well', icon: Logo },
  { id: 'intro3', title: 'Feel Great', icon: Logo },
  { id: 'auth_choice', title: 'Welcome', icon: User },
  { id: 'basics', title: 'Create Account', icon: User },
  { id: 'lifestyle', title: 'Your Lifestyle', icon: Activity },
];

export default function Onboarding({ onComplete, profile: savedProfile }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(savedProfile);

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
      case 0: // Splash Screen
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
            <p className="text-gray-300 text-xs animate-pulse">Tap to continue</p>
            <div className="absolute bottom-12 right-0 text-gray-400 text-sm font-medium italic">
              made by QWIN
            </div>
          </div>
        );
      case 1: // Intro 1
        return (
          <div className="text-center space-y-8">
            <div className="w-64 h-64 bg-blue-50 rounded-full mx-auto flex items-center justify-center">
              <span className="text-7xl">🥗</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Personalized Nutrition</h2>
              <p className="text-gray-500 leading-relaxed">
                Discover meal plans tailored specifically to your body type and fitness goals. No generic advice.
              </p>
            </div>
            <button onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
              Next
            </button>
          </div>
        );
      case 2: // Intro 2
        return (
          <div className="text-center space-y-8">
            <div className="w-64 h-64 bg-blue-50 rounded-full mx-auto flex items-center justify-center">
              <span className="text-7xl">👟</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Smart Habit Building</h2>
              <p className="text-gray-500 leading-relaxed">
                Build sustainable routines with our daily trackers. Consistency is the key to long-term health.
              </p>
            </div>
            <button onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
              Next
            </button>
          </div>
        );
      case 3: // Intro 3
        return (
          <div className="text-center space-y-8">
            <div className="w-64 h-64 bg-blue-50 rounded-full mx-auto flex items-center justify-center">
              <span className="text-7xl">💪</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Fitness Reimagined</h2>
              <p className="text-gray-500 leading-relaxed">
                Access guided workouts designed to reduce obesity-related risks and improve your vitality.
              </p>
            </div>
            <button onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
              Let's Start
            </button>
          </div>
        );
      case 4: // Auth Choice (Login/Sign Up)
        return (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white p-4 shadow-xl shadow-blue-100">
              <Logo />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Join OCC Today</h2>
              <p className="text-gray-500">Your journey to a better you starts here.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => setStep(5)} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
              >
                Create Account
              </button>
              <button 
                onClick={() => onComplete({ ...profile, onboarded: true })}
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold border border-blue-100"
              >
                Login
              </button>
            </div>
            <p className="text-xs text-gray-400">By continuing, you agree to our Terms and Conditions.</p>
          </div>
        );
      case 5: // Basics
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
      case 6: // Lifestyle
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
        <button onClick={prevStep} className={`p-2 text-gray-400 ${(step === 0 || step === 4) ? 'invisible' : ''}`}>
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
        {step >= 5 && (
          <button
            onClick={nextStep}
            disabled={step === 5 && !profile.name}
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
