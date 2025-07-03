import React from 'react';
import { BrushCleaning } from 'lucide-react';

export default function ResetStorageBox({
    buttons,
    className = '',
}: {
    buttons: {
        storageKey: string;
        label?: string;
        className?: string;
    }[];
    className?: string;
}) {
    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <div className="flex flex-row items-center justify-right">
                {buttons.map((button) => (
                    <ResetStorageButton
                        key={button.storageKey}
                        storageKey={button.storageKey}
                        label={button.label}
                        className={button.className}
                    />
                ))}
            </div>
        </div>
    );
}

export function ResetStorageButton({
    storageKey,
    label = 'Reset',
    className = '',
}: {
    storageKey: string;
    label?: string;
    className?: string;
}) {
    return (
        <button
            onClick={() => {
            localStorage.removeItem(storageKey);
            window.location.reload();
            }}
            className="flex flex-col items-center group m-2"
            >
            <BrushCleaning
            size={48}
            className="p-2 rounded-lg m-2
                bg-primary text-txt-secondary
                hover:bg-bg-secondary
                transition-colors duration-300 cursor-pointer"
            />

            <span className="text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">
            {label}
            </span>
        </button>
    );
}