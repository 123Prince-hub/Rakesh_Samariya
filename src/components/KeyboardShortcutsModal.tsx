import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'गीत चलाएं / रोकें (Play / Pause)' },
    { key: '← / →', desc: '10 सेकंड आगे / पीछे (Seek ±10s)' },
    { key: 'N', desc: 'अगला गीत (Next Track)' },
    { key: 'P', desc: 'पिछला गीत (Previous Track)' },
    { key: 'M', desc: 'म्यूट / अनम्यूट (Toggle Mute)' },
    { key: '↑ / ↓', desc: 'आवाज़ कम / ज़्यादा (Volume Up / Down)' },
    { key: 'R', desc: 'बारिश की आवाज़ (Toggle Rain Ambience)' },
    { key: 'L', desc: 'गीत सूची खोलें (Toggle Tracklist Queue)' },
    { key: 'F', desc: 'फ़ुलस्क्रीन (Fullscreen)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-sm rounded-2xl bg-[#1a120c] border border-amber-700/50 p-6 text-amber-100 shadow-2xl z-10 space-y-4"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base text-amber-200">
              कीबोर्ड शॉर्टकट्स (Controls)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-amber-200 hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between text-xs py-1 border-b border-stone-800/40">
              <span className="text-stone-300">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-black/70 border border-amber-700/40 text-amber-300 font-mono text-[11px] shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
