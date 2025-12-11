import React, { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Setup } from './components/system/Setup';
import { Login } from './components/system/Login';

type BootState = 'check' | 'setup' | 'login' | 'desktop';

interface UserData {
  username: string;
  passwordHash: string; // Storing plain text for this demo, usually would be hashed
}

function App() {
  const [bootState, setBootState] = useState<BootState>('check');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Simulate BIOS/Boot check
    const checkUser = () => {
      const stored = localStorage.getItem('opendoor_user');
      if (stored) {
        setUser(JSON.parse(stored));
        setBootState('login');
      } else {
        setBootState('setup');
      }
    };

    // Small delay for effect
    setTimeout(checkUser, 500);
  }, []);

  const handleSetupComplete = (username: string, password: string) => {
    const newUser = { username, passwordHash: password };
    localStorage.setItem('opendoor_user', JSON.stringify(newUser));
    setUser(newUser);
    setBootState('login'); // Go to login after setup, or straight to desktop? Usually login.
  };

  const handleLoginSuccess = () => {
    setBootState('desktop');
  };

  if (bootState === 'check') {
    return <div className="w-screen h-screen bg-black flex items-center justify-center text-white font-mono text-xs">Booting...</div>;
  }

  if (bootState === 'setup') {
    return <Setup onComplete={handleSetupComplete} />;
  }

  if (bootState === 'login' && user) {
    return <Login username={user.username} storedHash={user.passwordHash} onLogin={handleLoginSuccess} />;
  }

  if (bootState === 'desktop') {
    return <Desktop />;
  }

  return null;
}

export default App;