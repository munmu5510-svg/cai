import React, { useState } from 'react';
import { Card, Button } from '../components/Shared';
import { generateBusinessStrategy } from '../services/geminiService';
import { User, BusinessConcept } from '../types';
import { storageService } from '../services/storageService';
import { generateStrategyPDF } from '../services/pdfService';

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
        
        Act as the Marketer Agent (WySider). 
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
      setStrategy("System Error: An unexpected issue occurred within the UI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!strategy) return;
    
    // Create a title from the first few words of the idea or default
    const titleSnippet = idea.split(' ').slice(0, 5).join(' ') + (idea.split(' ').length > 5 ? '...' : '');
    const title = titleSnippet || "New Concept Strategy";

    const concept: BusinessConcept = {
      id: Date.now().toString(),
      title: title,
      description: idea,
      createdAt: Date.now(),
      strategy: strategy
    };

    storageService.saveConcept(user.id, concept);
    alert('Concept saved to secure storage.');
  };

  const handleExportPDF = () => {
    if (!strategy) return;
    const titleSnippet = idea.split(' ').slice(0, 8).join(' ') || "Business Strategy";
    generateStrategyPDF(titleSnippet, strategy, user, Date.now());
  };

  // Helper to check if the response is an error message
  const isError = strategy.startsWith("System Error") || strategy.startsWith("Configuration Error") || strategy.startsWith("Connection Error");

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
        <Card className="h-full overflow-y-auto min-h-[500px] border-electric-blue/30 relative">
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
            <div className="prose prose-invert max-w-none pb-20">
              {isError ? (
                <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200">
                  <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Transmission Failed
                  </h3>
                  <p>{strategy}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-cyan mb-6">
                    Strategic Blueprint
                  </h3>
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
                    {strategy}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-800 flex gap-4">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      Save to Storage
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleExportPDF}>
                      Download PDF
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};