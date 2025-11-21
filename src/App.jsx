import React, { useState } from 'react';
import { Map, Printer, Home } from 'lucide-react';
import RouteBuilder from './components/RouteBuilder';
import RouteTable from './components/RouteTable';
import LandingPage from './components/LandingPage';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'builder'
  const [steps, setSteps] = useState([]);

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('builder')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans print:bg-white">
      {/* Header - Hidden on Print */}
      <header className="bg-green-800 text-white p-4 shadow-md print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <Map className="w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-wide">ScoutRoute <span className="text-green-200 text-sm font-normal ml-2">Manual Builder</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-green-100 hover:text-white px-3 py-2 rounded transition"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded font-bold hover:bg-gray-100 transition"
              disabled={steps.length === 0}
            >
              <Printer className="w-4 h-4" />
              Print Routeboek
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 print:p-0">

        {/* Builder Interface */}
        <RouteBuilder steps={steps} setSteps={setSteps} />

        {/* Print View (Always rendered but visible/styled for print) */}
        {steps.length > 0 && (
          <div className="mt-12 print:mt-0">
            <div className="hidden print:block mb-4 text-center border-b-2 border-black pb-4">
              <h1 className="text-4xl font-bold uppercase">Routeboek</h1>
              <p className="text-xl mt-2">ScoutRoute Generator</p>
            </div>

            {/* We show the table on screen too for review */}
            <div className="print:block hidden">
              <RouteTable instructions={steps} />
            </div>

            {/* On screen preview of the table */}
            <div className="print:hidden mt-8">
              <h3 className="text-xl font-bold mb-4">Voorbeeld Routeboek</h3>
              <RouteTable instructions={steps} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
