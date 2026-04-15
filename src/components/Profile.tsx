import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Settings, Bell, Shield, Award, LogOut, ChevronRight, WifiOff, X, TrendingDown, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Logo from './Logo';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [editForm, setEditForm] = useState({
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
  });

  const badges = [
    { id: 'b1', name: 'Early Bird', icon: '🌅', earned: true },
    { id: 'b2', name: 'Water Warrior', icon: '💧', earned: true },
    { id: 'b3', name: 'Step Master', icon: '👟', earned: false },
    { id: 'b4', name: 'Healthy Eater', icon: '🥗', earned: true },
    { id: 'b5', name: 'Streak King', icon: '🔥', earned: false },
  ];

  const handleSignOut = () => {
    onUpdateProfile({ onboarded: false });
    setShowSignOutConfirm(false);
  };

  const handleSaveDetails = () => {
    onUpdateProfile(editForm);
    setShowEditDetails(false);
  };

  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  const activeRemindersCount = Object.values(profile.reminderPreferences).filter(Boolean).length;

  const weightData = [
    { day: 'Mon', weight: profile.weight + 2 },
    { day: 'Tue', weight: profile.weight + 1.5 },
    { day: 'Wed', weight: profile.weight + 1.2 },
    { day: 'Thu', weight: profile.weight + 0.8 },
    { day: 'Fri', weight: profile.weight + 0.5 },
    { day: 'Sat', weight: profile.weight + 0.2 },
    { day: 'Sun', weight: profile.weight },
  ];

  return (
    <div className="pb-32 pt-6 px-4 sm:px-6 space-y-8 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-200 p-6">
            <Logo />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-100">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <Trophy className="w-4 h-4 text-blue-600" />
            <p className="text-blue-600 font-black text-lg">{profile.points}</p>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Points</p>
          </div>
        </div>
      </div>

      {/* Health Summary Card */}
      <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Health Summary</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Live Data</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">BMI</p>
            <p className="text-xl font-black">{bmi}</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Weight</p>
            <p className="text-xl font-black">{profile.weight}<span className="text-xs ml-0.5">kg</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Height</p>
            <p className="text-xl font-black">{profile.height}<span className="text-xs ml-0.5">cm</span></p>
          </div>
        </div>
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-900 text-sm">Weight Journey</h3>
          </div>
          <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">-2.0kg this week</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
              />
              <YAxis 
                hide 
                domain={['dataMin - 1', 'dataMax + 1']} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="font-bold text-gray-900">Achievements</h2>
          <button className="text-blue-600 text-sm font-bold">View All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center p-4 rounded-3xl border min-w-[100px] transition-all",
                badge.earned ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-dashed border-gray-200 opacity-50"
              )}
            >
              <span className="text-3xl mb-2">{badge.icon}</span>
              <span className="text-[10px] font-bold text-gray-700 text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Health Profile</h3>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowEditDetails(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Personal Details</p>
                  <p className="text-xs text-gray-500 capitalize">{profile.age} yrs, {profile.weight} kg, {profile.height} cm</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Health Goals</p>
                  <p className="text-xs text-gray-500 capitalize">{profile.mainGoal.replace('-', ' ')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={() => setShowRemindersModal(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Reminders</p>
                  <p className="text-xs text-gray-500 capitalize">{activeRemindersCount} Active</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">App Settings</h3>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Offline Mode</p>
                  <p className={cn(
                    "text-xs font-medium",
                    profile.offlineMode ? "text-green-500" : "text-gray-400"
                  )}>
                    {profile.offlineMode ? "Enabled & Synced" : "Disabled"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onUpdateProfile({ offlineMode: !profile.offlineMode })}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-200",
                  profile.offlineMode ? "bg-blue-600" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200",
                  profile.offlineMode ? "right-1" : "left-1"
                )} />
              </button>
            </div>
            <button 
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center space-x-4 p-5 text-red-500 hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </section>
      </div>

      <footer className="text-center pb-8 space-y-2">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">made by QWIN</p>
        <p className="text-[10px] text-gray-400 font-medium">OCC v1.0.0 • Made with ❤️ for your health</p>
      </footer>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showEditDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditDetails(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Details</h2>
                <button onClick={() => setShowEditDetails(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Age (years)</label>
                  <input 
                    type="number" 
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={editForm.weight}
                      onChange={(e) => setEditForm({...editForm, weight: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Height (cm)</label>
                    <input 
                      type="number" 
                      value={editForm.height}
                      onChange={(e) => setEditForm({...editForm, height: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveDetails}
                className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-100"
              >
                Save Changes
              </button>
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
                <h2 className="text-xl font-bold text-gray-900">Health Goals</h2>
                <button onClick={() => setShowGoalsModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  { id: 'habits', label: 'Build healthier eating habits', icon: '🥗' },
                  { id: 'activity', label: 'Increase physical activity', icon: '🏃' },
                  { id: 'consistency', label: 'Improve consistency', icon: '📅' },
                  { id: 'weight-loss', label: 'Gradually manage weight', icon: '⚖️' },
                  { id: 'maintain', label: 'Maintain current weight', icon: '💪' },
                ].map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      onUpdateProfile({ mainGoal: goal.id as any });
                      setShowGoalsModal(false);
                    }}
                    className={cn(
                      "w-full flex items-center p-4 rounded-2xl border transition-all",
                      profile.mainGoal === goal.id
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-100 text-gray-700 hover:border-blue-200"
                    )}
                  >
                    <span className="text-2xl mr-4">{goal.icon}</span>
                    <span className="font-bold text-sm">{goal.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {showRemindersModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRemindersModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reminders</h2>
                <button onClick={() => setShowRemindersModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  { id: 'water', label: 'Drink Water', icon: '💧' },
                  { id: 'meals', label: 'Eat on Time', icon: '🍽️' },
                  { id: 'exercise', label: 'Exercise', icon: '👟' },
                  { id: 'sleep', label: 'Sleep', icon: '🌙' },
                  { id: 'checkins', label: 'Healthy Check-ins', icon: '✅' },
                ].map(rem => (
                  <div
                    key={rem.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{rem.icon}</span>
                      <span className="font-bold text-gray-700">{rem.label}</span>
                    </div>
                    <button
                      onClick={() =>
                        onUpdateProfile({
                          reminderPreferences: {
                            ...profile.reminderPreferences,
                            [rem.id]: !profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences],
                          },
                        })
                      }
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences]
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          profile.reminderPreferences[rem.id as keyof typeof profile.reminderPreferences]
                            ? "left-7"
                            : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowRemindersModal(false)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-100"
              >
                Done
              </button>
            </motion.div>
          </>
        )}

        {showSignOutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignOutConfirm(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sign Out?</h2>
                <button onClick={() => setShowSignOutConfirm(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-500 mb-8">Are you sure you want to sign out? Your progress is saved locally on this device.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-500 shadow-lg shadow-red-100"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
