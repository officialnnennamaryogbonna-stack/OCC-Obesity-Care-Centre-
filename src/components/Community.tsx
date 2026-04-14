import React, { useState } from 'react';
import { MOCK_CHALLENGES, MOCK_CHAT_MESSAGES } from '../constants';
import { ChatMessage, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trophy, MessageCircle, Heart, ChevronRight, Plus, Send, Shield, Info, Smile, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommunityProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  initialTab?: 'chat' | 'challenges';
  hideTabs?: boolean;
}

export default function Community({ profile, onUpdateProfile, initialTab = 'chat', hideTabs = false }: CommunityProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'challenges'>(initialTab);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [showJoinSuccess, setShowJoinSuccess] = useState<string | null>(null);

  // Sync activeTab with initialTab if it changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: profile.name || 'You',
      content: newMessage,
      timestamp: Date.now(),
      reactions: {}
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleJoinChallenge = (id: string) => {
    if (joinedChallenges.includes(id)) return;
    
    const challenge = MOCK_CHALLENGES.find(c => c.id === id);
    if (challenge) {
      onUpdateProfile({ points: profile.points + challenge.points });
    }

    setJoinedChallenges([...joinedChallenges, id]);
    setShowJoinSuccess(id);
    setTimeout(() => setShowJoinSuccess(null), 2000);
  };

  return (
    <div className="pb-24 pt-6 px-6 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Community</h2>
          <p className="text-gray-500 text-sm">You are not alone in this journey.</p>
        </div>
        <button 
          onClick={() => setShowGuidelines(true)}
          className="p-2 bg-blue-50 text-blue-600 rounded-full"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
              activeTab === 'chat' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
              activeTab === 'challenges' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Trophy className="w-4 h-4" />
            <span>Challenges</span>
          </button>
        </div>
      )}

      {activeTab === 'chat' ? (
        <div className="space-y-6">
          {/* Chat Input */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {profile.name?.[0] || 'U'}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share your progress..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                      {msg.userName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{msg.userName}</h4>
                      <p className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{msg.content}</p>
                
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {['❤️', '💪', '🙌', '🥗', '💧'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs border transition-all flex items-center space-x-1.5",
                        msg.reactions[emoji] ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-transparent text-gray-500"
                      )}
                    >
                      <span>{emoji}</span>
                      {msg.reactions[emoji] > 0 && <span className="font-bold">{msg.reactions[emoji]}</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Challenges Section */}
          <div className="grid grid-cols-1 gap-4">
            {MOCK_CHALLENGES.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
                    {challenge.icon === 'Droplets' ? '💧' : challenge.icon === 'Footprints' ? '👟' : '🥗'}
                  </div>
                  <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    +{challenge.points} pts
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{challenge.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">
                      +{challenge.participants - 3}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={joinedChallenges.includes(challenge.id)}
                    className={cn(
                      "text-xs font-bold px-4 py-2 rounded-xl transition-all",
                      joinedChallenges.includes(challenge.id) 
                        ? "bg-green-50 text-green-600 border border-green-100" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                  >
                    {joinedChallenges.includes(challenge.id) ? 'Joined' : 'Join'}
                  </button>
                </div>

                <AnimatePresence>
                  {showJoinSuccess === challenge.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                      <p className="text-sm font-bold text-gray-900">Challenge Joined!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines Modal */}
      <AnimatePresence>
        {showGuidelines && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-8 space-y-6"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-gray-900">Community Guidelines</h3>
                <p className="text-sm text-gray-500">Help us keep OCC a safe and supportive space for everyone.</p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Heart, text: "Be supportive and respectful to all members." },
                  { icon: Smile, text: "No body shaming or judgmental language." },
                  { icon: Info, text: "Share wellness tips, not medical advice." },
                  { icon: Shield, text: "Keep personal information private." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm text-gray-600">
                    <item.icon className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowGuidelines(false)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
