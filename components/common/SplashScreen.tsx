
import React from 'react';
import { GreenHatIcon } from '../../constants';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark-charcoal text-white animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
        .animate-popIn { animation: popIn 0.8s ease-out forwards; }
      `}</style>
      <div className="animate-popIn">
        <GreenHatIcon className="w-32 h-32 text-neon-green drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
      </div>
      <h1 className="mt-6 text-2xl font-sans font-bold tracking-wider text-gray-300 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        GreenHat Secure
      </h1>
      <p className="mt-2 text-lg font-mono text-neon-green animate-fadeIn" style={{ animationDelay: '1s' }}>
        "From Zero to GreenHat: Your Cybersecurity Career in a Map."
      </p>
    </div>
  );
};

export default SplashScreen;
