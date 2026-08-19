import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, Radio, Shuffle } from 'lucide-react';
import { PlayerState } from '../types';

interface TransistorRadioPlayerProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onTogglePlaylist: () => void;
  onToggleRain: () => void;
  rainEnabled: boolean;
  onTuneStation: (freq: number) => void;
}

export const TransistorRadioPlayer: React.FC<TransistorRadioPlayerProps> = ({
  playerState,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onTogglePlaylist,
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  const progressPercent = playerState.duration > 0 
    ? (playerState.currentTime / playerState.duration) * 100 
    : 0;

  return (
    <div 
      className="w-[94%] max-w-[450px] mx-auto flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-white select-none transition-all duration-300 relative z-20"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.12)', // Modern translucent frosted glass
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.5)',
      }}
    >
      <div className="w-full flex items-center gap-2.5 sm:gap-3">
        {/* 1. Left Compact Circular Thumbnail Artwork */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 shadow-md bg-black/40 ring-1.5 ring-white/50 relative flex items-center justify-center">
          {playerState.currentVideoId ? (
            <img 
              src={`https://img.youtube.com/vi/${playerState.currentVideoId}/mqdefault.jpg`} 
              alt="Song Cover"
              className="w-full h-full object-cover scale-[1.35]"
            />
          ) : (
            <Radio className="w-4 h-4 text-amber-200/80" />
          )}
        </div>

        {/* 2. Middle Section: Song Info, Progress Bar & Time */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Title */}
          <h2 className="text-[11px] sm:text-xs font-bold text-white truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight tracking-wide">
            {playerState.currentTitle || 'S. P. Balasubrahmanyam...'}
          </h2>
          
          {/* Artist */}
          <p className="text-[9px] sm:text-[10px] text-amber-100/80 truncate mt-0.5 font-medium drop-shadow-sm">
            {playerState.currentArtist || 'Vintage Transistor Radio'}
          </p>

          {/* Progress Slider Bar */}
          <div className="relative w-full flex items-center my-0.5">
            <input
              type="range"
              min="0"
              max={playerState.duration || 100}
              value={playerState.currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer relative z-10 transition-all [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none hover:[&::-webkit-slider-thumb]:scale-125"
              style={{
                background: `linear-gradient(to right, #ffffff ${progressPercent}%, rgba(255, 255, 255, 0.3) ${progressPercent}%)`
              }}
            />
          </div>

          {/* Time Counter */}
          <div className="text-[9px] sm:text-[10px] font-semibold text-amber-100/90 font-mono tracking-wider">
            {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
          </div>
        </div>

        {/* 3. Right Control Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-0.5">
          {/* Shuffle Button */}
          <button 
            onClick={onNext}
            title="Shuffle / Next" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 transition-all text-white flex items-center justify-center flex-shrink-0 border border-white/30 backdrop-blur-md shadow-sm"
          >
            <Shuffle className="w-3 h-3 text-white" />
          </button>

          {/* Previous Track Button */}
          <button 
            onClick={onPrevious} 
            title="Previous track"
            className="p-1 text-white/90 hover:text-white active:scale-90 transition-transform drop-shadow-sm"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Play/Pause Main Button */}
          <button 
            onClick={playerState.isPlaying ? onPause : onPlay} 
            title={playerState.isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-black shadow-[0_4px_18px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            {playerState.isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Track Button */}
          <button 
            onClick={onNext} 
            title="Next track"
            className="p-1 text-white/90 hover:text-white active:scale-90 transition-transform drop-shadow-sm"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Playlist Button */}
          <button 
            onClick={onTogglePlaylist} 
            title="Playlist Drawer"
            className="p-1 text-white/90 hover:text-white active:scale-90 transition-transform drop-shadow-sm"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
