import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import TulipDiagram from './TulipDiagram';
import InteractiveTulip from './InteractiveTulip';
import Strippenkaart from './Strippenkaart';

const RouteBuilder = ({ steps, setSteps, routeType = 'tulip' }) => {
    const [phase, setPhase] = useState('SELECT_TYPE'); // SELECT_TYPE, SELECT_ACTION, CONFIRM

    // State for Tulip Mode
    const [newStep, setNewStep] = useState({
        type: 'cross',
        action: 'straight',
        text: ''
    });

    // State for Strip Mode
    const [stripInput, setStripInput] = useState({
        left: 0,
        right: 0
    });

    const intersectionTypes = [
        { id: 'cross', label: '4-Sprong' },
        { id: 't_split', label: 'T-Splitsing' },
        { id: 't_split_left', label: 'Zijweg Links' },
        { id: 't_split_right', label: 'Zijweg Rechts' },
        { id: 'y_split', label: 'Y-Splitsing' },
    ];

    const handleAddStep = () => {
        if (routeType === 'strip') {
            setSteps([...steps, {
                id: Date.now(),
                type: 'strip_entry',
                left: stripInput.left,
                right: stripInput.right
            }]);
            // Reset input
            setStripInput({ left: 0, right: 0 });
        } else {
            setSteps([...steps, { ...newStep, id: Date.now() }]);
            setPhase('SELECT_TYPE');
            setNewStep({ type: 'cross', action: 'straight', text: '' });
        }
    };

    const handleRemoveStep = (id) => {
        setSteps(steps.filter(step => step.id !== id));
    };

    const getActionLabel = (action) => {
        const labels = {
            straight: 'Rechtdoor',
            left: 'Linksaf',
            right: 'Rechtsaf',
            slight_left: 'Flauw Links',
            slight_right: 'Flauw Rechts',
            sharp_left: 'Scherp Links',
            sharp_right: 'Scherp Rechts',
            uturn: 'Keren'
        };
        return labels[action] || action;
    };

    // --- STRIP MODE UI ---
    if (routeType === 'strip') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Input */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Nieuwe Situatie
                        </h2>

                        <div className="space-y-6">
                            {/* Left Strips Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Strepen Links</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setStripInput({ ...stripInput, left: num })}
                                            className={`w-10 h-10 rounded-lg font-bold transition-colors ${stripInput.left === num
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Strips Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Strepen Rechts</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setStripInput({ ...stripInput, right: num })}
                                            className={`w-10 h-10 rounded-lg font-bold transition-colors ${stripInput.right === num
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddStep}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Toevoegen aan Route
                            </button>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Voorbeeld</h3>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-full flex justify-center">
                            {/* Render a mini Strippenkaart with just this step */}
                            <div className="h-64 overflow-hidden">
                                <Strippenkaart steps={[{ type: 'strip_entry', left: stripInput.left, right: stripInput.right }]} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: List */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Route Stappen ({steps.length})</h2>
                        {steps.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                Nog geen stappen toegevoegd.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-700">
                                                    Links: {step.left} | Rechts: {step.right}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStep(step.id)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- TULIP MODE UI (Existing) ---
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Builder */}
            <div className="lg:col-span-1 space-y-6">

                {/* Phase 1: Select Type */}
                {phase === 'SELECT_TYPE' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Kies Situatie
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {intersectionTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setNewStep({ ...newStep, type: type.id });
                                        setPhase('SELECT_ACTION');
                                    }}
                                    className="flex flex-col items-center p-3 border-2 border-gray-100 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
                                >
                                    <div className="w-16 h-16 mb-2">
                                        <TulipDiagram type={type.id} showArrow={false} size={64} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Phase 2: Select Action (Interactive) */}
                {phase === 'SELECT_ACTION' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-green-800">Waar ga je heen?</h2>
                            <button onClick={() => setPhase('SELECT_TYPE')} className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" /> Terug
                            </button>
                        </div>

                        <div className="flex justify-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <InteractiveTulip
                                type={newStep.type}
                                onSelectAction={(action) => {
                                    setNewStep({ ...newStep, action });
                                    setPhase('CONFIRM');
                                }}
                            />
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Klik op de weg die je wilt inslaan.
                        </p>
                    </div>
                )}

                {/* Phase 3: Confirm */}
                {phase === 'CONFIRM' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-green-800">Bevestigen</h2>
                            <button onClick={() => setPhase('SELECT_ACTION')} className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" /> Terug
                            </button>
                        </div>

                        <div className="flex gap-4 items-center mb-6 bg-gray-50 p-4 rounded-lg">
                            <div className="w-24 h-24 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                                <TulipDiagram type={newStep.type} action={newStep.action} size={96} />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-800">{getActionLabel(newStep.action)}</p>
                                <p className="text-gray-500 text-sm">bij {intersectionTypes.find(t => t.id === newStep.type)?.label}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddStep}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Toevoegen aan Route
                        </button>
                    </div>
                )}

            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Route Stappen ({steps.length})</h2>
                    {steps.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            Nog geen stappen toegevoegd.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0">
                                            <TulipDiagram type={step.type} action={step.action} size={48} showArrow={true} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">{getActionLabel(step.action)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveStep(step.id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteBuilder;
