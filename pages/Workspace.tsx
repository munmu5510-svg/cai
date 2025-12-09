import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { generateBusinessStrategy } from '../services/geminiService';
import { User } from '../types';

interface WorkspaceProps {
  user: User;
}

export const Workspace: React.FC<WorkspaceProps> = ({ user }) => {
  const [idea, setIdea] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConceive = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setStrategy('');

    try {
      const prompt = `
        User Idea: ${idea}
        
        Act as the Marketer Agent (Concept AI). 
        Analyze this idea using the Seth Godin / Steve Jobs / Elon Musk framework.
        Provide a structured output:
        1. **The Concept Refined** (Make it remarkable)
        2. **The Tribe** (Who is it for? Be specific)
        3. **Value Proposition** (Low Cost / High Quality Disruption)
        4. **Client Acquisition Strategy** (First 100 users)
        5. **Scale Vision** (Path to $1B)
      `;
      
      const result = await generateBusinessStrategy(prompt);
      setStrategy(result || "Failed to generate strategy.");
    } catch (e) {
      setStrategy("Error connecting to the visionary matrix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fade-in">
      {/* Input Section */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <Card className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Conception Lab</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your raw business idea. We will refine it into a diamond.</p>
          
          <textarea
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-electric-blue mb-4"
            placeholder="e.g. An AI platform that connects coffee farmers directly to consumers..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          
          <Button 
            onClick={handleConceive} 
            disabled={loading || !idea}
            className={`w-full ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Analyzing...' : 'Generate Strategy'}
          </Button>
        </Card>
      </div>

      {/* Output Section */}
      <div className="w-full md:w-2/3">
        <Card className="h-full overflow-y-auto min-h-[500px] border-electric-blue/30">
          {!strategy && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
              <div className="w-24 h-24 border-4 border-gray-700 border-t-electric-blue rounded-full animate-spin mb-4" style={{ animationDuration: '3s' }}></div>
              <p>Waiting for input...</p>
            </div>
          )}
          
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-electric-blue">
               <p className="animate-pulse text-lg font-bold">Consulting Seth Godin...</p>
               <p className="animate-pulse text-sm text-gray-400 mt-2">Applying First Principles...</p>
            </div>
          )}

          {strategy && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-cyan mb-6">
                Strategic Blueprint
              </h3>
              <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
                {strategy}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <Button variant="outline" size="sm">Save to Local Storage</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
