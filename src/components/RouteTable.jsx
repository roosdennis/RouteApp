import React from 'react';
import TulipDiagram from './TulipDiagram';

const RouteTable = ({ instructions }) => {
    if (!instructions || instructions.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 print:w-full print:mt-0">
            <div className="grid grid-cols-3 gap-0 border-t border-l border-black">
                {instructions.map((inst, idx) => (
                    <div
                        key={inst.id}
                        className="relative border-b border-r border-black p-4 flex items-center justify-center aspect-square break-inside-avoid"
                    >
                        {/* Number Badge */}
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg print:bg-black print:text-white">
                            {idx + 1}
                        </div>

                        <TulipDiagram type={inst.type} action={inst.action} size={160} />
                    </div>
                ))}
            </div>
        </div>
    );
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

export default RouteTable;
