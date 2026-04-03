import React from 'react';
import { Home, Utensils, Dumbbell, BarChart2, MessageSquare, User, MapPin, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'meals', label: 'Meals', icon: Utensils },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-safe pt-2 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center p-2 transition-colors",
              activeTab === tab.id ? "text-blue-600" : "text-gray-400"
            )}
          >
            <tab.icon className={cn("w-6 h-6 mb-1", activeTab === tab.id && "animate-pulse")} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
