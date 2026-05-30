import { XCircleIcon } from "@heroicons/react/solid";
import { useAuth } from "../../contexts/AuthContext";

export default function ErrorMessage() {
  const { error, setError } = useAuth();

  return (
    error && (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl">
          <XCircleIcon
            onClick={() => setError("")}
            className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 cursor-pointer hover:text-red-600 dark:hover:text-red-300 transition-colors"
          />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      </div>
    )
  );
}