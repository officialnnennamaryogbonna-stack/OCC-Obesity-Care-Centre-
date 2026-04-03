import React, { useState } from 'react';
import { MOCK_GYMS } from '../constants';
import { Gym } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, Info, Search, Filter, ChevronRight, X, Navigation, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Gyms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | 'All'>('All');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const tags = ['All', 'Abuja', 'Lagos', 'Popular', 'Women-friendly', 'Affordable', 'Premium'];

  const filteredGyms = MOCK_GYMS.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         gym.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || gym.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleGetDirections = (gym: Gym) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pb-24 pt-6 px-6 space-y-6 max-w-lg mx-auto">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Gym Centers</h2>
          <p className="text-gray-500 text-sm">Find the best place to train.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", viewMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500")}
          >
            List
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", viewMode === 'map' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500")}
          >
            Map
          </button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or area..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-100 transition-all text-sm"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                selectedTag === tag ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-500 border border-gray-100"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredGyms.map(gym => (
            <motion.div
              key={gym.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGym(gym)}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 cursor-pointer hover:border-blue-200 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">{gym.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1 text-blue-600" />
                    {gym.area}, {gym.address.split(',').pop()?.trim()}
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl">
                  <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {gym.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-blue-600">View Details</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative h-[400px] bg-gray-100 rounded-[40px] overflow-hidden border border-gray-200 shadow-inner">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/7.48,9.05,11,0/600x400?access_token=mock')] bg-cover bg-center opacity-50" />
          
          {/* Mock Map Grid */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>

          {/* Map Pins */}
          {filteredGyms.map(gym => (
            <motion.button
              key={gym.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedGym(gym)}
              className="absolute p-2 bg-white rounded-full shadow-xl border-2 border-blue-600 z-10"
              style={{
                left: `${((gym.lng - 7.4) / 0.2) * 100}%`,
                top: `${(1 - (gym.lat - 9.0) / 0.2) * 100}%`
              }}
            >
              <MapPin className="w-5 h-5 text-blue-600 fill-blue-600" />
            </motion.button>
          ))}

          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/50 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Interactive Map View (Mock)</p>
          </div>
        </div>
      )}

      {/* Gym Detail Modal */}
      <AnimatePresence>
        {selectedGym && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGym(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] max-h-[90vh] overflow-y-auto space-y-8"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedGym.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-lg uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedGym.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedGym.description}</p>
                </div>
                <button onClick={() => setSelectedGym(null)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-bold text-gray-700">{selectedGym.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                    <p className="text-sm font-bold text-gray-700">{selectedGym.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hours</p>
                    <p className="text-sm font-bold text-gray-700">{selectedGym.hours}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => handleGetDirections(selectedGym)}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Get Directions</span>
                </button>
                <button 
                  className="p-4 bg-gray-100 text-gray-600 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
