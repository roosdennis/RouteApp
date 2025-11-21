import React, { useState } from 'react';
import TulipDiagram from './TulipDiagram';

const InteractiveTulip = ({ type, onActionSelect, size = 300 }) => {
    const [hoverAction, setHoverAction] = useState(null);

    // Define click zones based on type
    // Each zone has a path (for hit detection) and an action
    const zones = [];

    // Common zones
    const topZone = { action: 'straight', path: 'M 30 0 L 70 0 L 70 40 L 30 40 Z' };
    const leftZone = { action: 'left', path: 'M 0 30 L 40 30 L 40 70 L 0 70 Z' };
    const rightZone = { action: 'right', path: 'M 60 30 L 100 30 L 100 70 L 60 70 Z' };
    const topLeftZone = { action: 'slight_left', path: 'M 0 0 L 50 0 L 50 50 L 0 50 Z' };
    const topRightZone = { action: 'slight_right', path: 'M 50 0 L 100 0 L 100 50 L 50 50 Z' };

    switch (type) {
        case 'cross':
            zones.push(topZone, leftZone, rightZone);
            break;
        case 't_split':
            zones.push(leftZone, rightZone);
            break;
        case 't_split_left':
            zones.push(topZone, leftZone);
            break;
        case 't_split_right':
            zones.push(topZone, rightZone);
            break;
        case 'y_split':
            zones.push(topLeftZone, topRightZone);
            break;
        case 'straight':
            zones.push(topZone);
            break;
        default:
            zones.push(topZone, leftZone, rightZone);
    }

    return (
        <div className="relative inline-block cursor-pointer">
            {/* Base Diagram (No Arrow) */}
            <TulipDiagram type={type} showArrow={false} size={size} />

            {/* Ghost Arrow Layer */}
            {hoverAction && (
                <div className="absolute inset-0 pointer-events-none opacity-50">
                    <TulipDiagram type={type} action={hoverAction} showArrow={true} size={size} />
                </div>
            )}

            {/* Interaction Layer */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {zones.map((zone, i) => (
                    <path
                        key={i}
                        d={zone.path}
                        fill="transparent"
                        stroke="none"
                        className="hover:fill-green-500/20 transition-colors"
                        onMouseEnter={() => setHoverAction(zone.action)}
                        onMouseLeave={() => setHoverAction(null)}
                        onClick={() => onActionSelect(zone.action)}
                    />
                ))}
            </svg>

            <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-500 pointer-events-none">
                Klik op de weg die je in wilt slaan
            </div>
        </div>
    );
};

export default InteractiveTulip;
