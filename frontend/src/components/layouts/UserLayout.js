export default function UserLayout({ user, onlineUsersId, header = false }) {
  const isOnline = onlineUsersId?.includes(user?.uid);

  if (header) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <img className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200 dark:ring-slate-700" src={user?.photoURL} alt="" />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isOnline ? "bg-green-500" : "bg-gray-400 dark:bg-slate-500"}`} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white leading-tight">{user?.displayName}</p>
          <p className={`text-xs font-medium ${isOnline ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-slate-500"}`}>
            {isOnline ? "● Online" : "○ Offline"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <img className="w-11 h-11 rounded-full object-cover" src={user?.photoURL} alt="" />
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isOnline ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">{user?.displayName}</p>
        <p className={`text-xs ${isOnline ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-slate-500"}`}>
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}