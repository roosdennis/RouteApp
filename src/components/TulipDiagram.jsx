import React from 'react';

const TulipDiagram = ({ type = 'cross', action = 'straight', size = 100, showArrow = true }) => {
    // Center of the SVG
    const cx = 50;
    const cy = 50;

    // Configuration
    const roadWidth = 20;
    const roadColor = "white";
    const roadBorder = "black";
    const arrowColor = "black";

    // Helper to create road path based on angle (0 = Right, 90 = Down, 180 = Left, 270 = Up)
    const createRoadPath = (angleDeg) => {
        const rad = (angleDeg * Math.PI) / 180;
        const length = 60;
        const x = cx + length * Math.cos(rad);
        const y = cy + length * Math.sin(rad);

        const perp = rad + Math.PI / 2;
        const dx = (roadWidth / 2) * Math.cos(perp);
        const dy = (roadWidth / 2) * Math.sin(perp);

        return `M ${cx - dx} ${cy - dy} L ${x - dx} ${y - dy} L ${x + dx} ${y + dy} L ${cx + dx} ${cy + dy} Z`;
    };

    // Define Roads based on Type
    // Incoming is always from Bottom (90 degrees)
    const roads = [createRoadPath(90)];

    switch (type) {
        case 'cross': // 4-sprong
            roads.push(createRoadPath(270)); // Up
            roads.push(createRoadPath(180)); // Left
            roads.push(createRoadPath(0));   // Right
            break;
        case 't_split': // T-splitsing (Top bar)
            roads.push(createRoadPath(180)); // Left
            roads.push(createRoadPath(0));   // Right
            break;
        case 't_split_left': // Side road left
            roads.push(createRoadPath(270)); // Up
            roads.push(createRoadPath(180)); // Left
            break;
        case 't_split_right': // Side road right
            roads.push(createRoadPath(270)); // Up
            roads.push(createRoadPath(0));   // Right
            break;
        case 'y_split': // Y-splitsing
            roads.push(createRoadPath(225)); // Up-Left
            roads.push(createRoadPath(315)); // Up-Right
            break;
        case 'straight': // Just straight road (for side road logic maybe?)
            roads.push(createRoadPath(270)); // Up
            break;
        default:
            roads.push(createRoadPath(270)); // Default straight
            roads.push(createRoadPath(180));
            roads.push(createRoadPath(0));
    }

    // Define Arrow Path based on Action
    // Start dot
    const startX = 50;
    const startY = 85;
    const elbowX = 50;
    const elbowY = 50;

    let endX, endY;
    let rad = -Math.PI / 2; // Default Up

    switch (action) {
        case 'straight':
            rad = -Math.PI / 2; // Up
            break;
        case 'left':
            rad = Math.PI; // Left
            break;
        case 'right':
            rad = 0; // Right
            break;
        case 'slight_left':
            rad = -Math.PI * 0.75; // Up-Left
            break;
        case 'slight_right':
            rad = -Math.PI * 0.25; // Up-Right
            break;
        case 'sharp_left':
            rad = Math.PI * 0.75; // Down-Left
            break;
        case 'sharp_right':
            rad = Math.PI * 0.25; // Down-Right
            break;
        case 'uturn':
            rad = Math.PI / 2; // Down
            break;
    }

    const arrowLen = 35;
    endX = elbowX + arrowLen * Math.cos(rad);
    endY = elbowY + arrowLen * Math.sin(rad);

    // Arrowhead
    const arrowHeadLen = 8;
    const arrowAngle1 = rad + Math.PI * 0.85;
    const arrowAngle2 = rad - Math.PI * 0.85;

    const ahX1 = endX + arrowHeadLen * Math.cos(arrowAngle1);
    const ahY1 = endY + arrowHeadLen * Math.sin(arrowAngle1);
    const ahX2 = endX + arrowHeadLen * Math.cos(arrowAngle2);
    const ahY2 = endY + arrowHeadLen * Math.sin(arrowAngle2);

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="bg-white"
        >
            <g stroke={roadBorder} strokeWidth="2" fill={roadColor}>
                {roads.map((d, i) => <path key={i} d={d} />)}
                {/* Fix: Reduced radius to exactly roadWidth/2 to prevent bulge artifacts */}
                <circle cx={cx} cy={cy} r={roadWidth / 2} stroke="none" fill={roadColor} />
            </g>

            {showArrow && (
                <g fill="none" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={startX} cy={startY} r="3" fill={arrowColor} stroke="none" />
                    <path d={`M ${startX} ${startY} L ${elbowX} ${elbowY} L ${endX} ${endY}`} />
                    <polygon
                        points={`${endX},${endY} ${ahX1},${ahY1} ${ahX2},${ahY2}`}
                        fill={arrowColor}
                        stroke="none"
                    />
                </g>
            )}
        </svg>
    );
};

export default TulipDiagram;
