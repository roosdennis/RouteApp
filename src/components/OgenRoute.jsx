import React from 'react';
import OgenFace from './OgenFace';

const OgenRoute = ({ steps, theme }) => {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-8">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid"
                    >
                        <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                            {index + 1}
                        </div>

                        <div className="mb-4 transform scale-125">
                            <OgenFace direction={step.direction} theme={theme} size={120} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OgenRoute;
