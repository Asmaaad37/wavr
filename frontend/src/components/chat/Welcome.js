export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Messages</h2>
      <p className="text-gray-400 dark:text-slate-500 text-sm max-w-xs">
        Select a conversation from the sidebar or start a new chat to begin messaging.
      </p>
    </div>
  );
}