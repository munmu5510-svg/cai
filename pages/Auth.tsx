import React, { useState } from 'react';
import { Button, Input, Card } from '../components/Shared';
import { storageService } from '../services/storageService';
import { User, PlanType } from '../types';
import { PRICING } from '../constants';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('STANDARD');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }
      const users = storageService.getUsers();
      if (users.some(u => u.email === email)) {
        setError("User already exists.");
        return;
      }
      
      // Simulate Payment Process
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        plan: selectedPlan, // User chooses plan on signup
        role: 'USER',
        joinedAt: new Date().toISOString()
      };
      
      storageService.saveUser(newUser);
      storageService.setCurrentUser(newUser);
      onAuthSuccess(newUser);
    } else {
      const users = storageService.getUsers();
      const user = users.find(u => u.email === email); // Simple mock auth, no real password check for demo
      if (user) {
        // Ideally check password here if we stored it (we didn't for simplicity, assuming LocalStorage "auth")
        // For a real app, hash password. Here, we just trust the email lookup for the mockup.
        storageService.setCurrentUser(user);
        onAuthSuccess(user);
      } else {
        setError("User not found. Please sign up.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-vision-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">{isSignUp ? 'Join the Vision' : 'Welcome Back'}</h2>
          <p className="text-gray-400">Concept AI • The Marketer Agent</p>
        </div>

        {error && <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input 
              label="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Elon Musk"
            />
          )}
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="founder@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••"
          />

          {isSignUp && (
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              <div 
                onClick={() => setSelectedPlan('STANDARD')}
                className={`cursor-pointer p-4 rounded-lg border text-center transition-all ${selectedPlan === 'STANDARD' ? 'border-electric-blue bg-electric-blue/10' : 'border-gray-700 hover:bg-gray-800'}`}
              >
                <div className="font-bold text-white">Standard</div>
                <div className="text-sm text-gray-400">${PRICING.STANDARD}</div>
              </div>
              <div 
                onClick={() => setSelectedPlan('PRO_PLUS')}
                className={`cursor-pointer p-4 rounded-lg border text-center transition-all ${selectedPlan === 'PRO_PLUS' ? 'border-deep-purple bg-deep-purple/10' : 'border-gray-700 hover:bg-gray-800'}`}
              >
                <div className="font-bold text-white">Pro+</div>
                <div className="text-sm text-gray-400">${PRICING.PRO_PLUS}</div>
              </div>
            </div>
          )}

          <Button fullWidth type="submit" className="mt-6">
            {isSignUp ? (selectedPlan === 'PRO_PLUS' ? `Pay $${PRICING.PRO_PLUS} & Sign Up` : `Pay $${PRICING.STANDARD} & Sign Up`) : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? "Already have an account? " : "New entrepreneur? "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-electric-blue hover:underline">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
            <button onClick={onBack} className="text-xs text-gray-500 hover:text-gray-300">Back to Home</button>
        </div>
      </Card>
    </div>
  );
};
