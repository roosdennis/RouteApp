import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import TulipDiagram from './TulipDiagram';
import InteractiveTulip from './InteractiveTulip';

const RouteBuilder = ({ steps, setSteps }) => {
    const [phase, setPhase] = useState('SELECT_TYPE'); // SELECT_TYPE, SELECT_ACTION, CONFIRM
    const [newStep, setNewStep] = useState({
        type: 'cross',
        action: 'straight',
        text: ''
    });

    const intersectionTypes = [
        { value: 'cross', label: '4-Sprong' },
        { value: 't_split', label: 'T-Splitsing' },
        { value: 't_split_left', label: 'Zijweg Links' },
        { value: 't_split_right', label: 'Zijweg Rechts' },
        { value: 'y_split', label: 'Y-Splitsing' },
        { value: 'straight', label: 'Rechtdoor' },
    ];

    const handleTypeSelect = (type) => {
        setNewStep({ ...newStep, type });
        setPhase('SELECT_ACTION');
    };

    const handleActionSelect = (action) => {
        setNewStep({ ...newStep, action });
        setPhase('CONFIRM');
    };

    const addStep = () => {
        setSteps([...steps, { ...newStep, id: Date.now() }]);
        setNewStep({ ...newStep, text: '' });
        setPhase('SELECT_TYPE');
    };

    const removeStep = (id) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    const getActionLabel = (action) => {
        const map = {
            straight: 'Rechtdoor',
            left: 'Links',
            right: 'Rechts',
            slight_left: 'Flauw Links',
            slight_right: 'Flauw Rechts',
            sharp_left: 'Scherp Links',
            sharp_right: 'Scherp Rechts',
        };
        return map[action] || action;
    };

    return (
        <div className="max-w-4xl mx-auto print:hidden">
            {/* Visual Builder Area */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200 min-h-[400px] flex flex-col">

                {/* Header / Back Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {phase === 'SELECT_TYPE' && 'Stap 1: Kies de situatie'}
                        {phase === 'SELECT_ACTION' && 'Stap 2: Waar ga je heen?'}
                        {phase === 'CONFIRM' && 'Stap 3: Bevestigen'}
                    </h2>
                    {phase !== 'SELECT_TYPE' && (
                        <button
                            onClick={() => setPhase(phase === 'CONFIRM' ? 'SELECT_ACTION' : 'SELECT_TYPE')}
                            className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Terug
                        </button>
                    )}
                </div>

                {/* Phase 1: Select Type */}
                {phase === 'SELECT_TYPE' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {intersectionTypes.map(t => (
                            <button
                                key={t.value}
                                onClick={() => handleTypeSelect(t.value)}
                                className="flex flex-col items-center p-4 border rounded hover:bg-green-50 hover:border-green-500 transition group"
                            >
                                <div className="w-24 h-24 mb-2">
                                    <TulipDiagram type={t.value} showArrow={false} size={96} />
                                </div>
                                <span className="font-medium group-hover:text-green-700">{t.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Phase 2: Select Action (Interactive) */}
                {phase === 'SELECT_ACTION' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <InteractiveTulip
                            type={newStep.type}
                            onActionSelect={handleActionSelect}
                            size={300}
                        />
                    </div>
                )}

                {/* Phase 3: Confirm & Add */}
                {phase === 'CONFIRM' && (
                    <div className="flex flex-col items-center max-w-md mx-auto w-full">
                        <div className="mb-6 p-4 border rounded bg-gray-50">
                            <TulipDiagram type={newStep.type} action={newStep.action} size={150} />
                        </div>

                        <div className="mb-6 text-center text-gray-600">
                            <p>Controleer de pijl hierboven.</p>
                            <p>Klopt het? Voeg hem dan toe.</p>
                        </div>

                        <button
                            onClick={addStep}
                            className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Toevoegen aan Route
                        </button>
                    </div>
                )}
            </div>

            {/* List of Steps */}
            <div className="space-y-2">
                {steps.map((step, idx) => (
                    <div key={step.id} className="bg-white p-4 rounded border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-2 rounded">
                                <span className="font-bold text-gray-500">#{idx + 1}</span>
                            </div>
                            <TulipDiagram type={step.type} action={step.action} size={60} />
                            <div>
                                <p className="text-gray-600">{getActionLabel(step.action)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeStep(step.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {steps.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Nog geen stappen toegevoegd. Begin hierboven!
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteBuilder;
