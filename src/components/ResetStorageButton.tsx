import React from 'react';
import { BrushCleaning } from 'lucide-react';

export default function ResetStorageButton({
    storageKey,
    label = 'Reset',
    className = '',
}: {
    storageKey: string;
    label?: string;
    className?: string;
}) {
    return (
        <div className="fixed bottom-4 right-4 z-50">
        <button
            onClick={() => {
            localStorage.removeItem(storageKey);
            window.location.reload();
            }}
            className="flex flex-col items-center group"
        >
            <BrushCleaning
            size={48}
            className="p-2 rounded-lg m-2
                bg-red-500 text-white
                hover:bg-red-700
                transition-colors duration-300 cursor-pointer"
            />
            <span className="text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">
            configs
            </span>
        </button>
        </div>
    );
}