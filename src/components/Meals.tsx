import React, { useState } from 'react';
import { MOCK_MEALS } from '../constants';
import { Meal, DailyLog, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Clock, Flame, ChevronRight, X, Calendar as CalendarIcon, BookOpen, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import MealCalendar from './MealCalendar';

interface MealsProps {
  onUpdateLog: (updates: Partial<DailyLog>) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  dailyLog: DailyLog;
  profile: UserProfile;
}

export default function Meals({ onUpdateLog, onUpdateProfile, dailyLog, profile }: MealsProps) {
  const [activeTab, setActiveTab] = useState<'recipes' | 'calendar'>('recipes');
  const [filter, setFilter] = useState<string>(profile.dietaryPreference !== 'none' ? profile.dietaryPreference : 'all');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredMeals = MOCK_MEALS.filter(meal => {
    const matchesFilter = filter === 'all' || meal.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLogMeal = (meal: Meal) => {
    onUpdateLog({
      caloriesConsumed: dailyLog.caloriesConsumed + meal.calories,
      mealsLogged: [...dailyLog.mealsLogged, meal.id]
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedMeal(null);
    }, 1500);
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'high protein', label: 'High Protein' },
    { id: 'low sugar', label: 'Low Sugar' },
    { id: 'quick', label: 'Quick' },
    { id: 'vegetarian', label: 'Vegetarian' },
  ];

  return (
    <div className="pb-32 pt-6 px-4 sm:px-6 space-y-6 max-w-lg mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Hub</h1>
          <p className="text-gray-500 text-sm">Fuel your body with healthy choices.</p>
        </div>
      </header>

      {/* Top Tabs */}
      <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('recipes')}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'recipes' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Recipes</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'calendar' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Meal Calendar</span>
        </button>
      </div>

      {activeTab === 'recipes' ? (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    filter === f.id ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-100"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal List */}
          <div className="space-y-4">
            {filteredMeals.map(meal => {
              const isRecommended = (profile.mainGoal === 'weight-loss' && meal.calories < 400) || 
                                   (profile.mainGoal === 'activity' && meal.tags.includes('High Protein'));
              
              return (
                <motion.div
                  key={meal.id}
                  layoutId={meal.id}
                  onClick={() => setSelectedMeal(meal)}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:border-blue-200 transition-colors relative overflow-hidden"
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl flex items-center">
                      <Sparkles className="w-2 h-2 mr-1" />
                      COACH'S CHOICE
                    </div>
                  )}
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                    {meal.type === 'breakfast' ? '🥣' : meal.type === 'lunch' ? '🥗' : meal.type === 'dinner' ? '🍲' : '🍎'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {meal.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900">{meal.name}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center"><Flame className="w-3 h-3 mr-1" /> {meal.calories} kcal</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 15 min</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <MealCalendar onUpdateLog={onUpdateLog} dailyLog={dailyLog} />
      )}

      {/* Meal Detail Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMeal(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              layoutId={selectedMeal.id}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMeal.name}</h2>
                  <p className="text-blue-600 font-semibold">{selectedMeal.calories} Calories</p>
                </div>
                <button onClick={() => setSelectedMeal(null)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Ingredients</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedMeal.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Preparation</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedMeal.instructions}
                  </p>
                </div>
                <button 
                  onClick={() => handleLogMeal(selectedMeal)}
                  disabled={showSuccess}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2",
                    showSuccess ? "bg-green-500 text-white shadow-green-100" : "bg-blue-600 text-white shadow-blue-200"
                  )}
                >
                  {showSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Meal Logged!</span>
                    </>
                  ) : (
                    <span>Log this Meal</span>
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
