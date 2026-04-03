import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Flame, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FoodScannerProps {
  onClose: () => void;
}

export default function FoodScanner({ onClose }: FoodScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ name: string; calories: number; suggestion: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Mock AI analysis
    setTimeout(() => {
      setResult({
        name: "Avocado Toast with Egg",
        calories: 350,
        suggestion: "Great choice! This meal is rich in healthy fats and protein. Perfect for a balanced breakfast."
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Food Scanner</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">Take a Photo</p>
                  <p className="text-xs text-gray-500">or tap to upload from gallery</p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-lg">
                <img src={image} alt="Food" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                    <p className="font-bold animate-pulse">Analyzing Food...</p>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {result && !isAnalyzing && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-green-900">{result.name}</h3>
                        <div className="flex items-center text-green-700 text-sm font-medium mt-1">
                          <Flame className="w-4 h-4 mr-1" />
                          ~{result.calories} Calories
                        </div>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <p className="text-xs text-blue-800 leading-relaxed">
                        <span className="font-bold block mb-1">Healthy Suggestion:</span>
                        {result.suggestion}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
                    >
                      Log this Food
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
