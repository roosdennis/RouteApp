import React from 'react';

const Strippenkaart = ({ steps }) => {
    if (!steps || steps.length === 0) return null;

    // Configuration
    const stepHeight = 80;
    const lineWidth = 4;
    const stripLength = 30;
    const stripWidth = 3;
    const dotRadius = 8;
    // Increased padding from 100 to 150 to prevent overlap with End Bar
    const totalHeight = steps.length * stepHeight + 150;
    const centerX = 150; // Center of the SVG

    // Helper to calculate strips for a step
    const getStrips = (step) => {
        // Direct input support
        if (step.type === 'strip_entry') {
            return { left: step.left || 0, right: step.right || 0 };
        }

        // Legacy support for intersection types
        let left = 0;
        let right = 0;
        const { type, action } = step;

        if (type === 'cross') {
            if (action === 'straight') { left = 1; right = 1; }
            else if (action === 'left') { right = 2; }
            else if (action === 'right') { left = 2; }
        }
        else if (type === 't_split') {
            if (action === 'left') { right = 1; }
            else if (action === 'right') { left = 1; }
        }
        else if (type === 't_split_left') {
            if (action === 'straight') { left = 1; }
            else if (action === 'left') { right = 1; }
        }
        else if (type === 't_split_right') {
            if (action === 'straight') { right = 1; }
            else if (action === 'right') { left = 1; }
        }
        else if (type === 'y_split') {
            if (action === 'slight_left' || action === 'left') { right = 1; }
            else if (action === 'slight_right' || action === 'right') { left = 1; }
        }

        return { left, right };
    };

    // Helper to generate lines for a fan of strips
    const getFanLines = (cx, cy, count, side) => {
        // side: -1 for left, 1 for right
        const lines = [];
        const angles = [];

        if (count === 1) angles.push(0);
        else if (count === 2) angles.push(25, -25); // V-shape
        else if (count === 3) angles.push(35, 0, -35); // Fan
        else if (count === 4) angles.push(45, 15, -15, -45); // Star burst

        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            // y grows down, so -sin for up
            const x2 = cx + side * stripLength * Math.cos(rad);
            const y2 = cy - stripLength * Math.sin(rad);
            lines.push({ x1: cx, y1: cy, x2, y2 });
        });

        return lines;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white print:max-w-none print:w-auto">
            <svg
                width="300"
                height={totalHeight}
                viewBox={`0 0 300 ${totalHeight}`}
                className="mx-auto"
            >
                {/* Main Vertical Line */}
                <line
                    x1={centerX}
                    y1={totalHeight - 50}
                    x2={centerX}
                    y2={50}
                    stroke="black"
                    strokeWidth={lineWidth}
                    strokeLinecap="round"
                />

                {/* Start Dot */}
                <circle cx={centerX} cy={totalHeight - 50} r={dotRadius} fill="black" />

                {/* End Bar */}
                <line
                    x1={centerX - 20}
                    y1={50}
                    x2={centerX + 20}
                    y2={50}
                    stroke="black"
                    strokeWidth={lineWidth * 1.5}
                />
                <text x={centerX} y={30} textAnchor="middle" fontSize="16" fontWeight="bold">EIND</text>
                <text x={centerX} y={totalHeight - 20} textAnchor="middle" fontSize="16" fontWeight="bold">START</text>

                {/* Steps */}
                {steps.map((step, idx) => {
                    // Draw from bottom to top
                    const y = totalHeight - 50 - ((idx + 1) * stepHeight);
                    const { left, right } = getStrips(step);

                    return (
                        <g key={step.id || idx}>
                            {/* Number */}
                            <text x={centerX + 50} y={y + 5} fontSize="12" fill="gray">#{idx + 1}</text>

                            {/* Left Strips */}
                            {left > 0 && getFanLines(centerX, y, left, -1).map((line, i) => (
                                <line
                                    key={`l-${i}`}
                                    x1={line.x1} y1={line.y1}
                                    x2={line.x2} y2={line.y2}
                                    stroke="black"
                                    strokeWidth={stripWidth}
                                    strokeLinecap="round"
                                />
                            ))}

                            {/* Right Strips */}
                            {right > 0 && getFanLines(centerX, y, right, 1).map((line, i) => (
                                <line
                                    key={`r-${i}`}
                                    x1={line.x1} y1={line.y1}
                                    x2={line.x2} y2={line.y2}
                                    stroke="black"
                                    strokeWidth={stripWidth}
                                    strokeLinecap="round"
                                />
                            ))}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default Strippenkaart;
