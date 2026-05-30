import { format } from "timeago.js";

export default function Message({ message, self }) {
  const isSelf = self === message.sender;

  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isSelf
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm dark:bg-slate-700/80 dark:border-slate-600/30 dark:text-slate-100"
          }`}
        >
          {message.message}
        </div>
        <span className="text-xs text-gray-400 dark:text-slate-500 mt-1 px-1">
          {format(message.createdAt)}
        </span>
      </div>
    </div>
  );
}