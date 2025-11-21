import React from 'react';

const HelicopterRoute = ({ steps, scale: userScale }) => {
    if (!steps || steps.length === 0) return null;

    // Configuration
    const pxPerCm = 25; // 1 cm = 25 pixels

    // 1. Calculate all coordinates first to determine bounds
    const coords = steps.map(step => {
        const angleRad = (step.degrees - 90) * (Math.PI / 180);
        const lengthPx = step.distance * pxPerCm;
        const x = lengthPx * Math.cos(angleRad); // Relative to 0,0 center
        const y = lengthPx * Math.sin(angleRad);
        return { x, y, angleRad, id: step.id };
    });

    // 2. Find bounds (include 0,0 center)
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    coords.forEach(c => {
        minX = Math.min(minX, c.x);
        maxX = Math.max(maxX, c.x);
        minY = Math.min(minY, c.y);
        maxY = Math.max(maxY, c.y);
    });

    // 3. Add padding (for arrows, text, and breathing room)
    const padding = 60;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    // 4. Calculate ViewBox
    const width = maxX - minX;
    const height = maxY - minY;
    const viewBox = `${minX} ${minY} ${width} ${height}`;

    return (
        <div className="w-full mx-auto bg-white print:max-w-none print:w-full print:h-screen flex flex-col items-center justify-center">
            <svg
                width="100%"
                height="100%"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="border border-gray-200 rounded-lg bg-white print:border-0"
            >
                {/* Grid / Crosshair (Optional, faint) */}
                <line x1={0} y1={minY} x2={0} y2={maxY} stroke="#f0f0f0" strokeWidth="1" />
                <line x1={minX} y1={0} x2={maxX} y2={0} stroke="#f0f0f0" strokeWidth="1" />

                {/* North Arrow (Double Leg) - Always at 0,0 */}
                <g>
                    {/* Main North Arrow pointing UP */}
                    <line x1={-5} y1={0} x2={0} y2={-60} stroke="black" strokeWidth="2" />
                    <line x1={5} y1={0} x2={0} y2={-60} stroke="black" strokeWidth="2" />
                    {/* Arrowhead */}
                    <path d="M 0 -60 L -5 -50 L 5 -50 Z" fill="black" />
                    <text x="0" y="-70" textAnchor="middle" fontSize="14" fontWeight="bold">N</text>
                </g>

                {/* Scale Text - Bottom Right of the viewBox */}
                {userScale && (
                    <text
                        x={maxX - 10}
                        y={maxY - 10}
                        textAnchor="end"
                        fontSize="16"
                        fontWeight="bold"
                        fill="black"
                    >
                        Schaal: 1cm = {userScale}m
                    </text>
                )}

                {/* Central Hub */}
                <circle cx={0} cy={0} r="6" fill="black" />

                {/* Route Vectors */}
                {coords.map((point, idx) => {
                    const { x, y, angleRad } = point;

                    // Calculate arrowhead points
                    const arrowLen = 10;
                    const arrowLeftAngle = angleRad + (135 * Math.PI / 180);
                    const arrowRightAngle = angleRad - (135 * Math.PI / 180);

                    const xLeft = x + arrowLen * Math.cos(arrowLeftAngle);
                    const yLeft = y + arrowLen * Math.sin(arrowLeftAngle);
                    const xRight = x + arrowLen * Math.cos(arrowRightAngle);
                    const yRight = y + arrowLen * Math.sin(arrowRightAngle);

                    // Text position
                    const textDist = 20;
                    const xText = x + textDist * Math.cos(angleRad);
                    const yText = y + textDist * Math.sin(angleRad);

                    return (
                        <g key={point.id || idx}>
                            {/* Main Line */}
                            <line
                                x1={0}
                                y1={0}
                                x2={x}
                                y2={y}
                                stroke="black"
                                strokeWidth="2"
                            />

                            {/* Arrowhead */}
                            <polyline
                                points={`${xLeft},${yLeft} ${x},${y} ${xRight},${yRight}`}
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            />

                            {/* Number */}
                            <circle cx={xText} cy={yText} r="10" fill="white" stroke="black" strokeWidth="1" />
                            <text
                                x={xText}
                                y={yText}
                                dy="4"
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {idx + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default HelicopterRoute;
