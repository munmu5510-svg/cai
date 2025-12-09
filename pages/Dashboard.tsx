import React, { useEffect, useState } from 'react';
import { Card, Button, Icons, Modal } from '../components/Shared';
import { User, BusinessConcept } from '../types';
import { storageService } from '../services/storageService';
import { generateStrategyPDF } from '../services/pdfService';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [concepts, setConcepts] = useState<BusinessConcept[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<BusinessConcept | null>(null);

  useEffect(() => {
    const loadConcepts = async () => {
      if (!user?.id) return;
      const loaded = await storageService.getConcepts(user.id);
      // Sort by newest first
      setConcepts(loaded.sort((a, b) => b.createdAt - a.createdAt));
    };
    loadConcepts();
  }, [user.id]);

  const handleExportPDF = (concept: BusinessConcept) => {
    if (!concept.strategy) return;
    generateStrategyPDF(concept.title, concept.strategy, user, concept.createdAt);
  };

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
        <div onClick={() => setIsHistoryOpen(true)} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <Card className="bg-gradient-to-br from-vision-gray to-gray-900 h-full">
            <div className="flex items-center gap-3 mb-4 text-electric-blue">
              <Icons.Rocket />
              <h3 className="font-bold">Active Concepts</h3>
            </div>
            <div className="text-3xl font-bold text-white">{concepts.length}</div>
            <p className="text-sm text-gray-500 mt-2">Click to view history</p>
          </Card>
        </div>

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

      {/* History Modal */}
      <Modal 
        isOpen={isHistoryOpen} 
        onClose={() => { setIsHistoryOpen(false); setSelectedConcept(null); }} 
        title={selectedConcept ? "Strategy Details" : "Concept History"}
      >
        {!selectedConcept ? (
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {concepts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No concepts saved yet. Start in the Workspace!
              </div>
            ) : (
              concepts.map(concept => (
                <div 
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept)}
                  className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-electric-blue cursor-pointer transition-all group"
                >
                  <h4 className="font-bold text-white group-hover:text-electric-blue truncate">{concept.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{new Date(concept.createdAt).toLocaleDateString()}</span>
                    <Icons.ChevronRight />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              <h3 className="text-xl font-bold text-electric-blue mb-2">{selectedConcept.title}</h3>
              <p className="text-sm text-gray-400 mb-4 border-b border-gray-800 pb-2">
                Created: {new Date(selectedConcept.createdAt).toLocaleString()}
              </p>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                <div className="whitespace-pre-wrap">
                  {selectedConcept.strategy}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <Button variant="outline" fullWidth onClick={() => setSelectedConcept(null)}>Back</Button>
              <Button variant="primary" fullWidth onClick={() => handleExportPDF(selectedConcept)}>Download PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};