import { SearchIcon } from "@heroicons/react/solid";

export default function SearchUsers({ handleSearch }) {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
        <input
          type="search"
          placeholder="Search conversations..."
          className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700/50 dark:border-slate-600/30 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}