import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { User } from '../types';
import { PROMO_CODE, ADMIN_CODE } from '../constants';
import { storageService } from '../services/storageService';

interface AccountProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, onUpdateUser, onLogout }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleRedeem = () => {
    setMessage('');
    if (code === PROMO_CODE) {
      const updatedUser = { ...user, plan: 'PRO_PLUS' as const };
      storageService.saveUser(updatedUser);
      storageService.setCurrentUser(updatedUser);
      onUpdateUser(updatedUser);
      setMessage('Success! You have been upgraded to Pro+.');
    } else if (code === ADMIN_CODE) {
      const updatedUser = { ...user, role: 'ADMIN' as const };
      storageService.saveUser(updatedUser);
      storageService.setCurrentUser(updatedUser);
      onUpdateUser(updatedUser);
      setMessage('Success! You now have Admin privileges.');
    } else {
      setMessage('Invalid code.');
    }
    setCode('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Professional Account</h1>
      
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Profile Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-500 uppercase">Name</label>
            <p className="text-gray-200 font-medium">{user.name}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Email</label>
            <p className="text-gray-200 font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Current Plan</label>
            <p className="text-electric-blue font-bold">{user.plan === 'PRO_PLUS' ? 'PRO+' : 'STANDARD'}</p>
          </div>
           <div>
            <label className="text-xs text-gray-500 uppercase">Role</label>
            <p className="text-gray-200 font-medium">{user.role}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Redeem Code</h3>
        <p className="text-sm text-gray-400 mb-4">Enter a promo code or admin access code.</p>
        <div className="flex gap-4">
          <Input 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code (e.g. cai2301)"
          />
          <Button onClick={handleRedeem}>Apply</Button>
        </div>
        {message && <p className={`mt-4 text-sm ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={onLogout}>Sign Out</Button>
      </div>
    </div>
  );
};
