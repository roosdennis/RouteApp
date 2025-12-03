import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            onUpload(files[0]);
        }
    }, [onUpload]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className="w-full max-w-xl mx-auto p-8 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center print:hidden"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                accept=".gpx"
                className="hidden"
                onChange={handleChange}
            />
            <Upload className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">
                Sleep je GPX bestand hierheen
            </p>
            <p className="text-sm text-gray-500 mt-2">
                of klik om te selecteren
            </p>
        </div>
    );
};

export default FileUpload;
