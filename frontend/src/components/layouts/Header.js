import { useState } from "react";
import { Link } from "react-router-dom";
import { LogoutIcon } from "@heroicons/react/outline";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  const [modal, setModal] = useState(false);
  const { currentUser } = useAuth();

  return (
    <>
      <nav className="bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-700/50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Wavr
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggler />
            {currentUser && (
              <>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  onClick={() => setModal(true)}
                  title="Logout"
                >
                  <LogoutIcon className="h-5 w-5" />
                </button>
                <Link
                  to="/profile"
                  className="ml-1 ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 rounded-full transition-all duration-200"
                >
                  <img className="h-8 w-8 rounded-full object-cover" src={currentUser.photoURL} alt="profile" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}