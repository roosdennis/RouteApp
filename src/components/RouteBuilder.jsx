import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import TulipDiagram from './TulipDiagram';
import InteractiveTulip from './InteractiveTulip';
import Strippenkaart from './Strippenkaart';
import HelicopterRoute from './HelicopterRoute';
import OgenFace from './OgenFace';
import OgenRoute from './OgenRoute';

const RouteBuilder = ({ steps, setSteps, routeType = 'tulip', heliScale, setHeliScale, ogenTheme, setOgenTheme }) => {
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

    // State for Helicopter Mode
    const [heliInput, setHeliInput] = useState({
        degrees: 0,
        distance: 0
    });

    // State for Ogen Mode
    const [ogenInput, setOgenInput] = useState('straight');

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
            setStripInput({ left: 0, right: 0 });
        } else if (routeType === 'helicopter') {
            setSteps([...steps, {
                id: Date.now(),
                type: 'helicopter_entry',
                degrees: parseFloat(heliInput.degrees),
                distance: parseFloat(heliInput.distance)
            }]);
            setHeliInput({ degrees: 0, distance: 0 });
        } else if (routeType === 'ogen') {
            setSteps([...steps, {
                id: Date.now(),
                type: 'ogen_entry',
                direction: ogenInput
            }]);
            setOgenInput('straight');
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

    // --- OGEN MODE UI ---
    if (routeType === 'ogen') {
        const themes = [
            { id: 'smiley', label: 'Smiley' },
            { id: 'minecraft', label: 'Minecraft' },
            { id: 'sinterklaas', label: 'Sinterklaas' },
            { id: 'poes', label: 'Poes' },
            { id: 'monster', label: 'Monster' },
        ];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Input */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100">
                        <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Nieuwe Stap
                        </h2>

                        <div className="space-y-6">
                            {/* Theme Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kies Thema</label>
                                <div className="flex flex-wrap gap-2">
                                    {themes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setOgenTheme(theme.id)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors border ${ogenTheme === theme.id
                                                    ? 'bg-yellow-500 text-white border-yellow-600 shadow-md'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-yellow-50'
                                                }`}
                                        >
                                            {theme.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Direction Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Richting</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setOgenInput('left')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${ogenInput === 'left'
                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-yellow-200'
                                            }`}
                                    >
                                        <ArrowLeft className="w-8 h-8 mb-2" />
                                        <span className="font-bold">Links</span>
                                    </button>

                                    <button
                                        onClick={() => setOgenInput('straight')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${ogenInput === 'straight'
                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-yellow-200'
                                            }`}
                                    >
                                        <ArrowUp className="w-8 h-8 mb-2" />
                                        <span className="font-bold">Rechtdoor</span>
                                    </button>

                                    <button
                                        onClick={() => setOgenInput('right')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${ogenInput === 'right'
                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-yellow-200'
                                            }`}
                                    >
                                        <ArrowRight className="w-8 h-8 mb-2" />
                                        <span className="font-bold">Rechts</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddStep}
                                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-md flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Toevoegen aan Route
                            </button>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Voorbeeld</h3>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-full flex justify-center">
                            <div className="w-48 h-48 flex items-center justify-center">
                                <OgenFace direction={ogenInput} theme={ogenTheme} size={150} />
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
                                    <div key={step.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-yellow-200 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="w-16 h-16 flex items-center justify-center bg-white rounded border border-gray-200 flex-shrink-0">
                                                <OgenFace direction={step.direction} theme={ogenTheme} size={50} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-700">
                                                    {step.direction === 'left' && 'Linksaf'}
                                                    {step.direction === 'right' && 'Rechtsaf'}
                                                    {step.direction === 'straight' && 'Rechtdoor'}
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

                        {/* Live Preview of Full Route */}
                        {steps.length > 0 && (
                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-bold mb-4">Totaaloverzicht</h3>
                                <OgenRoute steps={steps} theme={ogenTheme} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- HELICOPTER MODE UI ---
    if (routeType === 'helicopter') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Input */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                        <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Nieuwe Vector
                        </h2>

                        <div className="space-y-6">
                            {/* Scale Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Schaal (1cm = ... meter)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={heliScale || 100}
                                    onChange={(e) => setHeliScale && setHeliScale(parseInt(e.target.value) || 100)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Degrees Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Graden (0-360)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={heliInput.degrees}
                                    onChange={(e) => setHeliInput({ ...heliInput, degrees: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Distance Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Afstand (cm)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={heliInput.distance}
                                    onChange={(e) => setHeliInput({ ...heliInput, distance: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                onClick={handleAddStep}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Toevoegen aan Route
                            </button>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Voorbeeld</h3>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-full flex justify-center">
                            {/* Render preview of JUST this step */}
                            <div className="w-64 h-64 overflow-hidden transform scale-75">
                                <HelicopterRoute steps={[{ degrees: heliInput.degrees, distance: heliInput.distance }]} scale={heliScale} />
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
                                Nog geen vectoren toegevoegd.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-700">
                                                    {step.degrees}° - {step.distance} cm
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

                        {/* Live Preview of Full Route */}
                        {steps.length > 0 && (
                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-bold mb-4">Totaaloverzicht</h3>
                                <HelicopterRoute steps={steps} scale={heliScale} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

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
