import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Send, Leaf, Bot, User, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import api from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const getTime = () => new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });

const TypingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
        className="w-2 h-2 rounded-full bg-primary-400"
      />
    ))}
  </div>
);

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Salom! 👋 Men AgroMarkaz AI yordamchisiman. Qishloq xo'jaligi, ob-havo, ekinlar va ferma boshqaruvi bo'yicha savollaringizga javob beraman.",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatai', { message: text });
      const reply =
        res.data?.reply ||
        res.data?.message ||
        res.data?.answer ||
        res.data?.text ||
        (typeof res.data === 'string' ? res.data : 'Javob olishda xatolik yuz berdi.');
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', text: reply, time: getTime() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: "Uzr, hozir javob bera olmayapman. Iltimos qayta urinib ko'ring.",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-widget"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed z-[500] flex flex-col overflow-hidden shadow-2xl chat-widget-pos"
        >
          {/* ── Header ─────────────────────────── */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)' }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-green-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">AgroMarkaz AI</p>
              <p className="text-green-200/80 text-[11px] mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Onlayn · Yordam berishga tayyor
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span className="text-[10px] text-white/80 font-semibold">AI</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ml-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* ── Messages ───────────────────────── */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar"
            style={{ background: '#f8faf9' }}
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mb-0.5 ${
                    msg.role === 'assistant'
                      ? 'bg-primary-100 border border-primary-200'
                      : 'bg-gray-200 border border-gray-300'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] flex flex-col gap-1 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'text-gray-800 bg-white border border-gray-100 shadow-sm rounded-bl-sm'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #15803d, #16a34a)' }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center shrink-0 mb-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Input ──────────────────────────── */}
          <div className="shrink-0 px-3 py-3 border-t border-gray-100 bg-white">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder="Savolingizni yozing..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-24 leading-relaxed disabled:opacity-50"
                style={{ scrollbarWidth: 'none' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    input.trim() && !loading
                      ? 'linear-gradient(135deg, #15803d, #16a34a)'
                      : '#e5e7eb',
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-white" style={{ marginLeft: '1px' }} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              AI javoblari ma'lumotnoma uchun. Mutaxassis bilan maslahatlashing.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ── Trigger button (sidebar "Bog'lanish") ── */
export const ChatTriggerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="w-full py-2 bg-white text-primary-700 text-xs font-semibold rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
  >
    <MessageSquare className="w-3.5 h-3.5" />
    Bog'lanish
  </motion.button>
);

export default ChatWidget;
