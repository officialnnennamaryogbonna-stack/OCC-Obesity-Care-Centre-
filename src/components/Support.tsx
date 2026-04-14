import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Trophy, MessageSquare, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import Assistant from './Assistant';
import Community from './Community';

interface SupportProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export default function Support({ profile, onUpdateProfile }: SupportProps) {
  const [activeTab, setActiveTab] = useState<'assistant' | 'community' | 'challenges'>('assistant');

  const tabs = [
    { id: 'assistant', label: 'Assistant', icon: Sparkles },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Tab Selector */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 pt-6 pb-4 sticky top-0 z-40">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl max-w-lg mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2",
                activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Assistant profile={profile} />
            </motion.div>
          )}
          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* We pass a prop or use a modified Community component that only shows chat */}
              <Community profile={profile} onUpdateProfile={onUpdateProfile} initialTab="chat" hideTabs />
            </motion.div>
          )}
          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Community profile={profile} onUpdateProfile={onUpdateProfile} initialTab="challenges" hideTabs />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
