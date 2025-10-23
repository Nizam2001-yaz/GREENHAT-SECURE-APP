
import React, { useState } from 'react';
import { GreenHatIcon } from '../../constants';
import type { User } from '../../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Mock login/register
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string || 'Guest User';
    onLogin({ email, fullName });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-charcoal p-4 font-sans text-gray-200">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <GreenHatIcon className="w-24 h-24 text-neon-green" />
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-neon-green/20 rounded-2xl shadow-lg shadow-neon-green/10">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-center text-gray-400 mt-2 font-mono text-sm">{isLogin ? 'Login to continue your journey' : 'Start learning in minutes.'}</p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {!isLogin && (
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  placeholder="Full Name"
                />
              )}
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                placeholder="Email Address"
              />
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                placeholder="Password"
              />
              
              <button
                type="submit"
                className="w-full py-3 font-bold text-dark-charcoal bg-neon-green rounded-lg hover:bg-green-400 transition-all duration-300 shadow-glow-green hover:shadow-glow-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-charcoal focus:ring-neon-green"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-6">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-neon-green hover:underline">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
