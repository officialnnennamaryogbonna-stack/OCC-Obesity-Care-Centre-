import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, Clock, Flame, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_MEALS } from '../constants';
import { Meal, DailyLog } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Mock data for the calendar
const INITIAL_CALENDAR_DATA: Record<string, Record<string, string[]>> = {
  'Mon': { breakfast: ['m1'], lunch: ['m2'], dinner: ['m3'], snacks: ['m4'] },
  'Tue': { breakfast: ['m1'], lunch: ['m2'], dinner: [], snacks: [] },
  'Wed': { breakfast: [], lunch: ['m2'], dinner: ['m3'], snacks: ['m4'] },
  'Thu': { breakfast: ['m1'], lunch: [], dinner: ['m3'], snacks: [] },
  'Fri': { breakfast: ['m1'], lunch: ['m2'], dinner: ['m3'], snacks: ['m4'] },
  'Sat': { breakfast: [], lunch: [], dinner: [], snacks: [] },
  'Sun': { breakfast: [], lunch: [], dinner: [], snacks: [] },
};

interface MealCalendarProps {
  onUpdateLog?: (updates: Partial<DailyLog>) => void;
  dailyLog?: DailyLog;
}

export default function MealCalendar({ onUpdateLog, dailyLog }: MealCalendarProps) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [calendarData, setCalendarData] = useState(INITIAL_CALENDAR_DATA);
  const [showAddModal, setShowAddModal] = useState<{ day: string, type: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getMealById = (id: string) => MOCK_MEALS.find(m => m.id === id);

  const handleAddMeal = (meal: Meal) => {
    if (!showAddModal) return;

    const { day, type } = showAddModal;
    const newDayData = { ...calendarData[day] };
    newDayData[type] = [...newDayData[type], meal.id];

    setCalendarData(prev => ({
      ...prev,
      [day]: newDayData
    }));

    // If it's today (mocking today as Mon for demo), update the daily log
    if (day === 'Mon' && onUpdateLog && dailyLog) {
      onUpdateLog({
        caloriesConsumed: dailyLog.caloriesConsumed + meal.calories,
        mealsLogged: [...dailyLog.mealsLogged, meal.id]
      });
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowAddModal(null);
    }, 1000);
  };

  const renderMealSection = (title: string, type: string, mealIds: string[]) => {
    const meals = mealIds.map(id => getMealById(id)).filter(Boolean) as Meal[];

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
          <button 
            onClick={() => setShowAddModal({ day: selectedDay, type })}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {meals.length > 0 ? (
          <div className="space-y-2">
            {meals.map((meal, i) => (
              <div key={`${meal.id}-${i}`} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {meal.type === 'breakfast' ? '🥣' : meal.type === 'lunch' ? '🥗' : meal.type === 'dinner' ? '🍲' : '🍎'}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">{meal.name}</h4>
                  <div className="flex items-center space-x-3 mt-0.5 text-[10px] text-gray-500">
                    <span className="flex items-center"><Flame className="w-3 h-3 mr-1" /> {meal.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-xs text-gray-400 font-medium">No {title.toLowerCase()} logged</p>
            <button 
              onClick={() => setShowAddModal({ day: selectedDay, type })}
              className="text-[10px] font-bold text-blue-600 uppercase tracking-widest"
            >
              Add Meal
            </button>
          </div>
        )}
      </div>
    );
  };

  const calculateDailyTotal = (day: string) => {
    const dayData = calendarData[day];
    let total = 0;
    Object.values(dayData).forEach(ids => {
      ids.forEach(id => {
        const meal = getMealById(id);
        if (meal) total += meal.calories;
      });
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-sm font-bold text-gray-900">April 2026</h2>
          <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="flex justify-between">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-xl transition-all",
                selectedDay === day ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{day}</span>
              <span className="text-sm font-black">{DAYS.indexOf(day) + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-blue-600 p-5 rounded-[32px] text-white flex justify-between items-center shadow-lg shadow-blue-200">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Daily Total</p>
          <h3 className="text-2xl font-black">{calculateDailyTotal(selectedDay).toLocaleString()} <span className="text-sm font-normal opacity-80">kcal</span></h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Goal</p>
          <h3 className="text-lg font-bold">2,000 <span className="text-xs font-normal opacity-80">kcal</span></h3>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-8 pb-8">
        {renderMealSection('Breakfast', 'breakfast', calendarData[selectedDay].breakfast)}
        {renderMealSection('Lunch', 'lunch', calendarData[selectedDay].lunch)}
        {renderMealSection('Dinner', 'dinner', calendarData[selectedDay].dinner)}
        {renderMealSection('Snacks', 'snacks', calendarData[selectedDay].snacks)}
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] max-h-[70vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add {showAddModal.type}</h2>
                  <p className="text-gray-500 text-xs">Choose a meal for {showAddModal.day}</p>
                </div>
                <button onClick={() => setShowAddModal(null)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {MOCK_MEALS.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => handleAddMeal(meal)}
                    className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 hover:border-blue-200 transition-all"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                      {meal.type === 'breakfast' ? '🥣' : meal.type === 'lunch' ? '🥗' : meal.type === 'dinner' ? '🍲' : '🍎'}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-bold text-gray-900">{meal.name}</h4>
                      <p className="text-[10px] text-gray-500">{meal.calories} kcal</p>
                    </div>
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                ))}
              </div>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-t-[40px]"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <p className="text-xl font-bold text-gray-900">Meal Added!</p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
