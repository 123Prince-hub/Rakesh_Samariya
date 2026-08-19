import React from 'react';

interface HiddenYouTubePlayerProps {
  containerId: string;
}

export const HiddenYouTubePlayer: React.FC<HiddenYouTubePlayerProps> = ({ containerId }) => {
  return (
    <div 
      className="fixed bottom-2 right-2 w-64 h-36 opacity-[0.01] pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      <div id={containerId} className="w-full h-full" />
    </div>
  );
};
