import React from 'react';

const OgenFace = ({ direction = 'straight', theme = 'smiley', size = 100 }) => {
    // Calculate pupil offset based on direction
    const getPupilOffset = () => {
        const offset = 6; // Distance to move pupils
        switch (direction) {
            case 'left': return -offset;
            case 'right': return offset;
            default: return 0;
        }
    };

    const pupilX = getPupilOffset();

    // Common Eye Component
    const Eyes = ({ y = -10, eyeDist = 15, eyeSize = 6, pupilSize = 3 }) => (
        <g>
            {/* Left Eye */}
            <circle cx={-eyeDist} cy={y} r={eyeSize} fill="white" stroke="black" strokeWidth="2" />
            <circle cx={-eyeDist + pupilX} cy={y} r={pupilSize} fill="black" />

            {/* Right Eye */}
            <circle cx={eyeDist} cy={y} r={eyeSize} fill="white" stroke="black" strokeWidth="2" />
            <circle cx={eyeDist + pupilX} cy={y} r={pupilSize} fill="black" />
        </g>
    );

    const renderTheme = () => {
        switch (theme) {
            case 'minecraft':
                return (
                    <g>
                        {/* Head */}
                        <rect x="-40" y="-40" width="80" height="80" fill="#56B000" stroke="black" strokeWidth="3" />
                        {/* Eyes (Square) */}
                        <rect x="-25" y="-15" width="16" height="16" fill="white" stroke="black" strokeWidth="2" />
                        <rect x={-25 + 4 + (pupilX > 0 ? 4 : pupilX < 0 ? -4 : 0)} y="-11" width="8" height="8" fill="black" />

                        <rect x="9" y="-15" width="16" height="16" fill="white" stroke="black" strokeWidth="2" />
                        <rect x={9 + 4 + (pupilX > 0 ? 4 : pupilX < 0 ? -4 : 0)} y="-11" width="8" height="8" fill="black" />

                        {/* Mouth */}
                        <rect x="-10" y="15" width="20" height="10" fill="black" />
                    </g>
                );

            case 'sinterklaas':
                return (
                    <g>
                        {/* Beard */}
                        <path d="M -35 10 Q -35 45 0 45 Q 35 45 35 10" fill="white" stroke="black" strokeWidth="2" />
                        {/* Face */}
                        <circle cx="0" cy="0" r="35" fill="#FFCC99" stroke="black" strokeWidth="2" />
                        {/* Mitre */}
                        <path d="M -35 -20 L 0 -65 L 35 -20" fill="red" stroke="black" strokeWidth="2" />
                        <line x1="0" y1="-65" x2="0" y2="-20" stroke="#FFD700" strokeWidth="2" />
                        <line x1="-15" y1="-40" x2="15" y2="-40" stroke="#FFD700" strokeWidth="2" />
                        {/* Eyes */}
                        <Eyes y={-5} />
                        {/* Mouth */}
                        <path d="M -10 20 Q 0 30 10 20" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );

            case 'poes':
                return (
                    <g>
                        {/* Ears */}
                        <path d="M -35 -25 L -45 -55 L -15 -35 Z" fill="#FFA500" stroke="black" strokeWidth="2" />
                        <path d="M 35 -25 L 45 -55 L 15 -35 Z" fill="#FFA500" stroke="black" strokeWidth="2" />
                        {/* Face */}
                        <circle cx="0" cy="0" r="40" fill="#FFA500" stroke="black" strokeWidth="2" />
                        {/* Eyes */}
                        <Eyes y={-10} eyeSize={8} />
                        {/* Nose */}
                        <path d="M -5 5 L 5 5 L 0 12 Z" fill="pink" stroke="black" strokeWidth="1" />
                        {/* Mouth */}
                        <path d="M 0 12 Q -10 20 -20 15" fill="none" stroke="black" strokeWidth="2" />
                        <path d="M 0 12 Q 10 20 20 15" fill="none" stroke="black" strokeWidth="2" />
                        {/* Whiskers */}
                        <line x1="-20" y1="10" x2="-50" y2="5" stroke="black" strokeWidth="1" />
                        <line x1="-20" y1="15" x2="-50" y2="15" stroke="black" strokeWidth="1" />
                        <line x1="-20" y1="20" x2="-50" y2="25" stroke="black" strokeWidth="1" />
                        <line x1="20" y1="10" x2="50" y2="5" stroke="black" strokeWidth="1" />
                        <line x1="20" y1="15" x2="50" y2="15" stroke="black" strokeWidth="1" />
                        <line x1="20" y1="20" x2="50" y2="25" stroke="black" strokeWidth="1" />
                    </g>
                );

            case 'monster':
                return (
                    <g>
                        {/* Horns */}
                        <path d="M -20 -35 Q -30 -60 -50 -50" fill="#88CC00" stroke="black" strokeWidth="2" />
                        <path d="M 20 -35 Q 30 -60 50 -50" fill="#88CC00" stroke="black" strokeWidth="2" />
                        {/* Face (Blob) */}
                        <path d="M -40 -30 Q -50 0 -30 40 Q 0 50 30 40 Q 50 0 40 -30 Q 0 -50 -40 -30" fill="#88CC00" stroke="black" strokeWidth="2" />
                        {/* One Big Eye */}
                        <circle cx="0" cy="-10" r="18" fill="white" stroke="black" strokeWidth="2" />
                        <circle cx={pupilX * 1.5} cy="-10" r="8" fill="black" />
                        {/* Teeth */}
                        <path d="M -20 20 L -15 30 L -10 20 L -5 30 L 0 20 L 5 30 L 10 20 L 15 30 L 20 20" fill="white" stroke="black" strokeWidth="1" />
                    </g>
                );

            case 'smiley':
            default:
                return (
                    <g>
                        {/* Face */}
                        <circle cx="0" cy="0" r="40" fill="#FFD700" stroke="black" strokeWidth="2" />
                        {/* Eyes */}
                        <Eyes />
                        {/* Mouth */}
                        <path d="M -20 15 Q 0 35 20 15" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    </g>
                );
        }
    };

    return (
        <svg width={size} height={size} viewBox="-50 -70 100 140" className="overflow-visible">
            {renderTheme()}
        </svg>
    );
};

export default OgenFace;
