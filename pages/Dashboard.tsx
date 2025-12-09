import React from 'react';
import { Card, Button, Icons } from '../components/Shared';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-400">Ready to disrupt the market today?</p>
        </div>
        <Button onClick={() => onNavigate('WORKSPACE')}>
          <span className="mr-2">+</span> New Concept
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-vision-gray to-gray-900">
          <div className="flex items-center gap-3 mb-4 text-electric-blue">
            <Icons.Rocket />
            <h3 className="font-bold">Active Concepts</h3>
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <p className="text-sm text-gray-500 mt-2">2 in Strategy Phase</p>
        </Card>

        <Card className="bg-gradient-to-br from-vision-gray to-gray-900">
          <div className="flex items-center gap-3 mb-4 text-deep-purple">
            <Icons.User />
            <h3 className="font-bold">Plan Status</h3>
          </div>
          <div className="text-2xl font-bold text-white">{user.plan === 'PRO_PLUS' ? 'Pro+' : 'Standard'}</div>
          <p className="text-sm text-gray-500 mt-2">Visionary Tier</p>
        </Card>

        <Card className="bg-gradient-to-br from-vision-gray to-gray-900">
          <div className="flex items-center gap-3 mb-4 text-neon-cyan">
            <Icons.Chat />
            <h3 className="font-bold">CAI Status</h3>
          </div>
          <div className="text-2xl font-bold text-white">Online</div>
          <p className="text-sm text-gray-500 mt-2">Ready to assist</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-full">
           <h3 className="text-xl font-bold text-white mb-4">Latest Insights</h3>
           <div className="space-y-4">
             {[
               "Focus on the 'Minimum Viable Audience' first (Godin).",
               "Simplify the user journey. Remove all friction (Jobs).",
               "Automate early to prepare for massive scale (Musk)."
             ].map((tip, i) => (
               <div key={i} className="p-3 bg-black/30 rounded border-l-2 border-electric-blue text-gray-300 text-sm">
                 "{tip}"
               </div>
             ))}
           </div>
        </Card>

        <Card className="h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icons.Rocket />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth className="justify-start" onClick={() => onNavigate('WORKSPACE')}>
              Launch New Strategy
            </Button>
            <Button variant="outline" fullWidth className="justify-start" onClick={() => onNavigate('ACCOUNT')}>
              Upgrade Plan
            </Button>
            <Button variant="ghost" fullWidth className="justify-start text-red-400 hover:text-red-300" onClick={() => window.open('https://seths.blog/', '_blank')}>
              Read Seth's Blog
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
