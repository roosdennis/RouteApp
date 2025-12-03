import React, { useState } from 'react';
import { Map, Printer, Home } from 'lucide-react';
import RouteBuilder from './components/RouteBuilder';
import RouteTable from './components/RouteTable';
import LandingPage from './components/LandingPage';
import Strippenkaart from './components/Strippenkaart';
import HelicopterRoute from './components/HelicopterRoute';
import OgenRoute from './components/OgenRoute';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'builder'
  const [routeType, setRouteType] = useState('tulip'); // 'tulip', 'strip', 'helicopter', 'ogen'
  const [steps, setSteps] = useState([]);
  const [heliScale, setHeliScale] = useState(100); // Default scale for helicopter
  const [ogenTheme, setOgenTheme] = useState('smiley'); // Default theme for ogen

  const handleStart = (type) => {
    setRouteType(type);
    setView('builder');
    setSteps([]); // Reset steps when starting new
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Navigation Bar - Hidden in Print */}
      <nav className="bg-white shadow-sm border-b border-gray-200 print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                RouteMaker
              </span>
            </div>

            {view === 'builder' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView('landing')}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  <Printer className="w-5 h-5" />
                  <span>Afdrukken</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">

        {/* Landing Page */}
        {view === 'landing' && (
          <LandingPage onStart={handleStart} />
        )}

        {/* Builder View */}
        {view === 'builder' && (
          <div className="space-y-8">
            {/* Editor Interface - Hidden in Print */}
            <div className="print:hidden">
              <RouteBuilder
                steps={steps}
                setSteps={setSteps}
                routeType={routeType}
                heliScale={heliScale}
                setHeliScale={setHeliScale}
                ogenTheme={ogenTheme}
                setOgenTheme={setOgenTheme}
              />
            </div>

            {/* Print View */}
            <div className="hidden print:block">
              {/* Header - Conditional for Helicopter */}
              {routeType !== 'helicopter' && (
                <div className="mb-8 text-center border-b-2 border-black pb-4">
                  <h1 className="text-4xl font-bold uppercase tracking-wider">Routeboek</h1>
                  <p className="text-gray-500 mt-2">Gegenereerd met RouteMaker</p>
                </div>
              )}

              {/* Content based on Route Type */}
              {routeType === 'tulip' && (
                <RouteTable steps={steps} />
              )}

              {routeType === 'strip' && (
                <Strippenkaart steps={steps} />
              )}

              {routeType === 'helicopter' && (
                <HelicopterRoute steps={steps} scale={heliScale} />
              )}

              {routeType === 'ogen' && (
                <OgenRoute steps={steps} theme={ogenTheme} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
