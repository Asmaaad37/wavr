import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import Picker from "emoji-picker-react";

export default function ChatForm({ handleFormSubmit }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [showEmojiPicker]);

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleFormSubmit(message);
    setMessage("");
  };

  return (
    <div ref={scrollRef}>
      {showEmojiPicker && (
        <div className="px-4 pb-2">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-400 dark:bg-slate-700/50 dark:border-slate-600/30 dark:focus-within:border-indigo-500/30 transition-all duration-200">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-400 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex-shrink-0"
          >
            <EmojiHappyIcon className="h-6 w-6" />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-4 w-4 rotate-90" />
          </button>
        </div>
      </form>
    </div>
  );
}