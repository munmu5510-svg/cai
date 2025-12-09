import React from 'react';
import { Button, Logo } from '../components/Shared';
import { PRICING, MOCK_FEATURES } from '../constants';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-vision-black text-white overflow-hidden">
      {/* Hero */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Logo className="w-8 h-8" />
        <Button variant="outline" size="sm" onClick={onStart}>Log In</Button>
      </nav>

      <section className="relative pt-20 pb-32 px-4 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-deep-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
          Launch Your Billion Dollar <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-cyan">Vision Today</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The only marketer agent powered by the collective genius of Godin, Jobs, and Musk. 
          From conception to acquisition, we build the future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button size="lg" onClick={onStart} className="shadow-[0_0_20px_rgba(37,99,235,0.5)]">Start Disruption</Button>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-vision-dark/50 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          {[
             { title: "Godin's Tribes", desc: "Build a movement, not just a customer base. We focus on minimum viable audience." },
             { title: "Jobs' Perfection", desc: "Product quality is marketing. We obsess over details that others ignore." },
             { title: "Musk's Scale", desc: "First principles thinking to reduce costs and scale to billions." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-vision-gray border border-gray-800 hover:border-electric-blue/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
         <h2 className="text-4xl font-bold text-center mb-16">Investment in Future</h2>
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-vision-gray border border-gray-800 flex flex-col">
               <h3 className="text-2xl font-bold text-gray-200">Standard</h3>
               <div className="text-4xl font-bold mt-4 mb-6">${PRICING.STANDARD}</div>
               <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex items-center gap-2 text-gray-400">✓ Basic Business Conception</li>
                 <li className="flex items-center gap-2 text-gray-400">✓ WySider Support</li>
                 <li className="flex items-center gap-2 text-gray-400">✓ Local Storage Save</li>
               </ul>
               <Button variant="outline" fullWidth onClick={onStart}>Choose Standard</Button>
            </div>
            <div className="relative p-8 rounded-2xl bg-vision-gray border border-electric-blue flex flex-col">
               <div className="absolute top-0 right-0 bg-electric-blue text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
               <h3 className="text-2xl font-bold text-white">Pro+</h3>
               <div className="text-4xl font-bold mt-4 mb-6">${PRICING.PRO_PLUS}</div>
               <ul className="space-y-3 mb-8 flex-1">
                 {MOCK_FEATURES.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">✓ {f}</li>
                 ))}
               </ul>
               <Button variant="primary" fullWidth onClick={onStart}>Go Pro+</Button>
            </div>
         </div>
      </section>
    </div>
  );
};