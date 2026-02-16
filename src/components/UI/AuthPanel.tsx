import type { User } from 'firebase/auth';
import { isFirebaseEnabled } from '../../firebase/config';

interface AuthPanelProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AuthPanel({ user, onLogin, onLogout }: AuthPanelProps) {
  return (
    <div className="p-4 bg-gray-800 rounded flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Firebase Account</p>
        {!isFirebaseEnabled && <p className="text-xs text-yellow-300">Set REACT_APP_FIREBASE_* vars to enable.</p>}
        {user ? (
          <p className="text-sm text-gray-300">Signed in as {user.displayName ?? user.email ?? user.uid}</p>
        ) : (
          <p className="text-sm text-gray-400">Sign in to save and review games across devices.</p>
        )}
      </div>

      {user ? (
        <button onClick={onLogout} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
          Sign out
        </button>
      ) : (
        <button
          onClick={onLogin}
          disabled={!isFirebaseEnabled}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
