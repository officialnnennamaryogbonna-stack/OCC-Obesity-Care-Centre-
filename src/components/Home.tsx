import React, { useState } from 'react';
import { UserProfile, DailyLog } from '../types';
import { calculateBMI, cn } from '../lib/utils';
import { OBESITY_FACTS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, TrendingUp, Scale, Droplets, Footprints, Flame, Trophy, AlertCircle, ChevronRight, Plus, Info, Camera, X, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_HISTORY = [
  { date: 'Mon', weight: 82, steps: 4500, water: 4 },
  { date: 'Tue', weight: 81.5, steps: 6200, water: 6 },
  { date: 'Wed', weight: 81.2, steps: 8100, water: 8 },
  { date: 'Thu', weight: 81.0, steps: 7500, water: 7 },
  { date: 'Fri', weight: 80.8, steps: 9200, water: 8 },
  { date: 'Sat', weight: 80.5, steps: 11000, water: 9 },
  { date: 'Sun', weight: 80.0, steps: 8500, water: 8 },
];
import FoodScanner from './FoodScanner';
import Logo from './Logo';

interface HomeProps {
  profile: UserProfile;
  dailyLog: DailyLog;
  onUpdateLog: (updates: Partial<DailyLog>) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onTabChange: (tab: string) => void;
}

export default function Home({ profile, dailyLog, onUpdateLog, onUpdateProfile, onTabChange }: HomeProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const { score: bmi, category: bmiCategory, color: bmiColor } = calculateBMI(profile.weight, profile.height);
  const randomFact = OBESITY_FACTS[Math.floor(Math.random() * OBESITY_FACTS.length)];

  const waterProgress = (dailyLog.waterIntake / 8) * 100;
  const stepsProgress = (dailyLog.steps / 10000) * 100;

  const getPersonalizedTip = () => {
    if (profile.mainGoal === 'weight-loss') {
      return "Focus on high-fiber meals today to stay full longer. You've got this!";
    }
    if (profile.mainGoal === 'activity') {
      return "Every step counts. Try taking a 5-minute walk after your next meal!";
    }
    return "Consistency is key. Small daily wins lead to big lifestyle changes!";
  };

  const defaultHabits = [
    { id: 'h1', label: 'No Soda', icon: '🥤' },
    { id: 'h2', label: 'Eat Salad', icon: '🥗' },
    { id: 'h3', label: 'Take Stairs', icon: '🪜' },
    { id: 'h4', label: 'Stretch', icon: '🧘' },
  ];

  const toggleHabit = (habitId: string) => {
    const currentHabits = dailyLog.habits || {};
    const isCompleting = !currentHabits[habitId];
    
    if (isCompleting) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      onUpdateProfile({ points: profile.points + 5 });
    }

    onUpdateLog({
      habits: {
        ...currentHabits,
        [habitId]: isCompleting
      }
    });
  };

  const handleToggleGoal = (goalId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa']
      });
      onUpdateProfile({ points: profile.points + 10 });
    }
    
    if (goalId === 'workout') {
      onUpdateLog({ workoutCompleted: !currentStatus });
    } else if (goalId === 'water') {
      onUpdateLog({ waterIntake: currentStatus ? 0 : 8 });
    } else if (goalId === 'meals') {
      onUpdateLog({ mealsLogged: currentStatus ? [] : ['m1', 'm2'] });
    }
  };

  const goals = [
    { id: 'workout', label: 'Morning Workout', done: dailyLog.workoutCompleted, icon: '👟' },
    { id: 'meals', label: 'Healthy Lunch', done: dailyLog.mealsLogged.length >= 2, icon: '🥗' },
    { id: 'water', label: '8 Glasses of Water', done: dailyLog.waterIntake >= 8, icon: '💧' },
  ];

  return (
    <div className="pb-32 pt-6 px-4 sm:px-6 space-y-8 max-w-lg mx-auto">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl p-2.5 shadow-lg shadow-blue-200">
            <Logo className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hi, {profile.name}! 👋</h1>
            <p className="text-gray-500 text-xs">Your wellness journey at a glance.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
            <Trophy className="w-4 h-4 text-blue-600" />
            <span className="font-black text-blue-600 text-sm">{profile.points}</span>
          </div>
          <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-orange-600 text-sm">3 Day Streak</span>
          </div>
        </div>
      </div>

      {/* Personalized Coach Tip */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Coach's Daily Tip</span>
          </div>
          <p className="text-lg font-bold leading-tight">{getPersonalizedTip()}</p>
          <p className="text-blue-100 text-xs opacity-80">Based on your goal: {profile.mainGoal.replace('-', ' ')}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Daily Goal Progress */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Daily Goal</h3>
          <span className="text-blue-600 font-bold text-sm">75% Done</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500">You're almost there! Complete your last habit to hit 100%.</p>
      </div>

      {/* BMI & Weight Summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-2"
        >
          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold border-4", bmiColor.replace('text', 'border'))}>
            {bmi}
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">BMI Score</p>
            <p className="text-xs sm:text-sm font-bold text-gray-900">{bmiCategory}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-2"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight</p>
            <p className="text-xs sm:text-sm font-bold text-gray-900">{profile.weight} kg</p>
          </div>
        </motion.div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 space-y-3">
          <div className="flex justify-between items-center">
            <Droplets className="w-5 h-5 text-blue-600" />
            <button onClick={() => onUpdateLog({ waterIntake: dailyLog.waterIntake + 1 })} className="p-1 bg-white rounded-full shadow-sm active:scale-95 transition-transform">
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <div>
            <p className="text-xs text-blue-600 font-medium">Water Intake</p>
            <p className="text-lg sm:text-xl font-bold text-blue-900">{dailyLog.waterIntake}/8 <span className="text-xs font-normal">glasses</span></p>
          </div>
          <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${Math.min(waterProgress, 100)}%` }} />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 space-y-3">
          <div className="flex justify-between items-center">
            <Footprints className="w-5 h-5 text-orange-600" />
            <Info className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-orange-600 font-medium">Daily Steps</p>
            <p className="text-lg sm:text-xl font-bold text-orange-900">{dailyLog.steps.toLocaleString()}</p>
          </div>
          <div className="h-1.5 bg-orange-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 transition-all" style={{ width: `${Math.min(stepsProgress, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Habit Tracker Section */}
      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Habit Tracker</h3>
          <button 
            onClick={() => setShowHabitModal(true)}
            className="text-blue-600 text-xs font-bold px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Manage
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {defaultHabits.map(habit => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                "flex flex-col items-center p-2 sm:p-3 rounded-2xl border transition-all active:scale-95",
                dailyLog.habits?.[habit.id] 
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-100"
              )}
            >
              <span className="text-lg sm:text-xl mb-1">{habit.icon}</span>
              <span className={cn(
                "text-[7px] sm:text-[8px] font-bold uppercase text-center",
                dailyLog.habits?.[habit.id] ? "text-green-600" : "text-gray-400"
              )}>
                {habit.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Summary (Weight Trend) */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Weight Trend</h3>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">-2.0 kg this week</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_HISTORY}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meal Calendar Preview */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Meal Calendar</h3>
          <button 
            onClick={() => onTabChange('meals')}
            className="text-blue-600 text-xs font-bold flex items-center"
          >
            View Full <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="flex justify-between">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                i < 3 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              )}>
                {i < 3 ? '🥗' : '🥣'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Goals */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Today's Goals</h2>
          <button 
            onClick={() => setShowGoalsModal(true)}
            className="text-blue-600 text-sm font-medium flex items-center"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {goals.map((goal) => (
            <button 
              key={goal.id} 
              onClick={() => handleToggleGoal(goal.id, goal.done)}
              className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-3 text-left">
                <span className="text-xl">{goal.icon}</span>
                <span className={cn("font-medium", goal.done ? "text-gray-400 line-through" : "text-gray-700")}>{goal.label}</span>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", 
                goal.done ? "bg-green-500 border-green-500" : "border-gray-200"
              )}>
                {goal.done && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Join Challenges Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTabChange('support')}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-[32px] text-white text-left relative overflow-hidden shadow-xl shadow-blue-100"
      >
        <div className="relative z-10 space-y-2">
          <h3 className="text-lg font-bold">Join Community Challenges</h3>
          <p className="text-blue-100 text-xs max-w-[200px]">Compete with others and earn extra points for your health journey!</p>
          <div className="pt-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Join Now</span>
          </div>
        </div>
        <Trophy className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 -rotate-12" />
      </motion.button>

      {/* Healthy Routine Streaks */}
      <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Current Streak</p>
            <p className="text-lg font-bold text-indigo-900">5 Days Healthy</p>
          </div>
        </div>
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
          +50 pts
        </div>
      </div>

      {/* Health Alert Summary */}
      {dailyLog.waterIntake < 3 && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Low Hydration Alert</p>
            <p className="text-xs text-red-700">You've only had {dailyLog.waterIntake} glasses of water today. Staying hydrated helps your metabolism!</p>
          </div>
        </div>
      )}

      {/* Daily Fact Widget */}
      <div className="bg-indigo-600 p-5 rounded-3xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-2">Daily Fact</h4>
          <p className="text-sm leading-relaxed font-medium">"{randomFact}"</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500 rounded-full opacity-50" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowScanner(true)}
          className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-2"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Camera className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-xs font-bold text-gray-700">Scan Food</span>
        </button>
        <button 
          onClick={() => setShowActivityModal(true)}
          className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-2"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Flame className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-gray-700">Add Activity</span>
        </button>
      </div>

      <AnimatePresence>
        {showScanner && <FoodScanner onClose={() => setShowScanner(false)} />}
        
        {showActivityModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivityModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Activity</h2>
                <button onClick={() => setShowActivityModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">Log your physical activity to track your calories burned.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga', 'Gym'].map(activity => (
                    <button 
                      key={activity}
                      onClick={() => {
                        onUpdateLog({ caloriesBurned: dailyLog.caloriesBurned + 100 });
                        setShowActivityModal(false);
                      }}
                      className="p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showGoalsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalsModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Goals</h2>
                <button onClick={() => setShowGoalsModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Morning Workout', done: dailyLog.workoutCompleted, icon: '👟' },
                  { label: 'Healthy Lunch', done: dailyLog.mealsLogged.length >= 2, icon: '🥗' },
                  { label: '8 Glasses of Water', done: dailyLog.waterIntake >= 8, icon: '💧' },
                  { label: '10k Steps', done: dailyLog.steps >= 10000, icon: '🚶' },
                  { label: 'No Sugary Drinks', done: true, icon: '🥤' },
                  { label: '7h Sleep', done: false, icon: '😴' },
                ].map((goal, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{goal.icon}</span>
                      <span className={cn("font-medium", goal.done ? "text-gray-400 line-through" : "text-gray-700")}>{goal.label}</span>
                    </div>
                    {goal.done && <Trophy className="w-4 h-4 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {showHabitModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHabitModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Habits</h2>
                <button onClick={() => setShowHabitModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-6">Select the habits you want to track daily.</p>
              <div className="space-y-3 mb-8">
                {[
                  ...defaultHabits,
                  { id: 'h5', label: 'No Junk Food', icon: '🍔' },
                  { id: 'h6', label: 'Read 10m', icon: '📖' },
                  { id: 'h7', label: 'Meditate', icon: '🧘‍♂️' },
                  { id: 'h8', label: 'Early Bed', icon: '😴' },
                ].map(habit => (
                  <div key={habit.id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{habit.icon}</span>
                      <span className="font-bold text-gray-700">{habit.label}</span>
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        dailyLog.habits?.[habit.id] ? "bg-green-500" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        dailyLog.habits?.[habit.id] ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowHabitModal(false)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-100"
              >
                Done
              </button>
            </motion.div>
          </>
        )}

        {showAchievements && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAchievements(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <button onClick={() => setShowAchievements(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Early Bird', icon: '🌅', desc: 'Log before 8 AM', done: true },
                  { name: 'Water Warrior', icon: '💧', desc: '8 glasses/day', done: dailyLog.waterIntake >= 8 },
                  { name: 'Step Master', icon: '👟', desc: '10k steps/day', done: dailyLog.steps >= 10000 },
                  { name: 'Healthy Eater', icon: '🥗', desc: '3 healthy meals', done: dailyLog.mealsLogged.length >= 3 },
                ].map((badge, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-3xl border flex flex-col items-center text-center space-y-2",
                    badge.done ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100 opacity-50"
                  )}>
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{badge.name}</p>
                      <p className="text-[10px] text-gray-500">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowAchievements(false)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-100"
              >
                Keep Going!
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Motivational Quote */}
      <div className="text-center space-y-2 py-4">
        <p className="text-gray-400 italic text-sm">"The only bad workout is the one that didn't happen."</p>
        <div className="flex justify-center space-x-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-1 h-1 bg-blue-200 rounded-full" />
          ))}
        </div>
      </div>

      <footer className="text-center pt-8 pb-4">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">made by QWIN</p>
      </footer>
    </div>
  );
}
