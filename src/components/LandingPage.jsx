import React from 'react';
import { Map, ArrowRight, Compass } from 'lucide-react';

const LandingPage = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-2xl text-center space-y-8">

                {/* Icon / Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm">
                        <Compass className="w-24 h-24 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
                    ScoutRoute
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-green-100 font-light max-w-lg mx-auto leading-relaxed">
                    Maak eenvoudig professionele
                    <span className="font-bold text-white mx-2">Bolletje-Pijltje</span>
                    routeboekjes voor je volgende tocht.
                </p>

                {/* Features Grid (Small) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-100 mt-8 opacity-80">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-full"><Map className="w-5 h-5" /></div>
                        <span>Visuele Builder</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-full"><ArrowRight className="w-5 h-5" /></div>
                        <span>Direct Printen</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-full"><Compass className="w-5 h-5" /></div>
                        <span>Scouting Proof</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => onStart('tulip')}
                        className="group relative inline-flex items-center gap-3 bg-white text-green-800 px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-green-50 hover:scale-105 transition-all duration-300"
                    >
                        Bolletje-Pijltje
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => onStart('strip')}
                        className="group relative inline-flex items-center gap-3 bg-green-900 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-green-800 hover:scale-105 transition-all duration-300 border border-green-700"
                    >
                        Strippenkaart
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => onStart('helicopter')}
                        className="group relative inline-flex items-center gap-3 bg-blue-900 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-blue-800 hover:scale-105 transition-all duration-300 border border-blue-700"
                    >
                        Helikopter
                        <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                    </button>
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-green-200/60 text-sm">
                    &copy; {new Date().getFullYear()} ScoutRoute Generator
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
