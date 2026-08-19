import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Disc3, 
  Radio, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  Image as ImageIcon,
  Upload,
  Volume2
} from 'lucide-react';
import { experienceConfig } from '../config';
import { PlayerState, PlaylistPreset } from '../types';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerState;
  activePlaylistId: string;
  onSelectPreset: (preset: PlaylistPreset) => void;
  onSelectTrack: (index: number) => void;
  onLoadCustomPlaylist: (playlistId: string) => void;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  playerState,
  activePlaylistId,
  onSelectPreset,
  onSelectTrack,
  onLoadCustomPlaylist,
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'queue' | 'custom'>('stations');
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    let playlistId = customInput.trim();
    // Extract playlist ID if user pasted full YouTube URL
    if (playlistId.includes('list=')) {
      const match = playlistId.match(/list=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        playlistId = match[1];
      }
    }
    onLoadCustomPlaylist(playlistId);
    setActiveTab('queue');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md transition-opacity">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div 
        className="relative w-full max-w-md h-full bg-[#140e0a] border-l border-amber-800/40 shadow-2xl flex flex-col z-10 overflow-hidden text-amber-100"
        style={{
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/50 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-amber-200">
                रेडियो स्टेशन और गीत सूची
              </h3>
              <p className="text-[11px] text-amber-400/60 font-mono">
                Curated Indian Soundtracks & Playlists
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-900/40 bg-stone-950/60 px-3 pt-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-3 py-2 rounded-t-lg font-mono transition-colors ${
              activeTab === 'stations'
                ? 'bg-[#1e140e] text-amber-300 border-t border-x border-amber-700/50 font-bold'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            स्टेशन (Stations)
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-2 rounded-t-lg font-mono transition-colors ${
              activeTab === 'queue'
                ? 'bg-[#1e140e] text-amber-300 border-t border-x border-amber-700/50 font-bold'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            गीत सूची (Queue)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 rounded-t-lg font-mono transition-colors ${
              activeTab === 'custom'
                ? 'bg-[#1e140e] text-amber-300 border-t border-x border-amber-700/50 font-bold'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            कस्टम URL
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: CURATED STATIONS */}
          {activeTab === 'stations' && (
            <div className="space-y-3">
              <p className="text-xs text-amber-300/70 font-sans">
                Select an authentic Indian atmosphere & soundtrack:
              </p>
              {experienceConfig.music.playlists.map((preset) => {
                const isActive = activePlaylistId === preset.playlistId;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-amber-950/70 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-black/40 border-amber-900/40 hover:bg-stone-900/60 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-700/40">
                            {preset.moodTag}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              PLAYING
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-amber-100 mt-1 text-sm group-hover:text-amber-300 transition-colors">
                          {preset.name}
                        </h4>
                        <p className="text-xs text-amber-200/80 font-serif">
                          {preset.hindiName}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">
                          {preset.description}
                        </p>
                      </div>

                      <div className={`p-2 rounded-full ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-300 group-hover:bg-amber-600 group-hover:text-stone-950'} transition-all`}>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CURRENT QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
                <span className="text-xs font-mono text-amber-300/80">
                  {playerState.playlist.length > 0
                    ? `${playerState.playlist.length} Tracks in Queue`
                    : 'Continuous Radio Playback'}
                </span>
                <span className="text-[10px] text-stone-400">Auto-advances to next</span>
              </div>

              {/* Active Now Playing Banner */}
              <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 animate-pulse" /> NOW PLAYING #{playerState.currentTrackIndex + 1}
                  </span>
                  <p className="text-xs font-bold text-[#fffbeb] truncate mt-0.5">
                    {playerState.currentTitle || 'शाम के नग़मे'}
                  </p>
                  <p className="text-[11px] text-amber-300/70 truncate">
                    {playerState.currentArtist || 'Transistor Radio'}
                  </p>
                </div>
              </div>

              {/* Playlist Tracks items */}
              <div className="space-y-1.5 mt-3">
                {playerState.playlist.length > 0 ? (
                  playerState.playlist.map((videoId, idx) => {
                    const isCurrent = idx === playerState.currentTrackIndex;
                    return (
                      <div
                        key={`${videoId}-${idx}`}
                        onClick={() => onSelectTrack(idx)}
                        className={`p-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isCurrent
                            ? 'bg-amber-900/40 text-amber-200 border border-amber-600/50 font-bold'
                            : 'hover:bg-stone-900/60 text-stone-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[11px] text-amber-500/70 w-5">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="truncate">
                            {isCurrent && playerState.currentTitle
                              ? playerState.currentTitle
                              : `Melody #${idx + 1}`}
                          </span>
                        </div>
                        {isCurrent && (
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-3 bg-amber-400 animate-pulse" />
                            <span className="w-1 h-2 bg-amber-400 animate-pulse delay-75" />
                            <span className="w-1 h-3.5 bg-amber-400 animate-pulse delay-150" />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-stone-400">
                    <Disc3 className="w-8 h-8 mx-auto text-amber-500/40 animate-spin mb-2" />
                    Playlist loaded directly via YouTube embedded continuous feed.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM YOUTUBE PLAYLIST URL */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-amber-200">
                  अपना पसंदीदा YouTube Playlist चलाएं
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Paste any public or unlisted YouTube Playlist URL or ID below to enjoy it in this immersive world:
                </p>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-amber-300/80 mb-1">
                    YouTube Playlist URL or ID:
                  </label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-amber-800/60 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  प्लेलिस्ट लोड करें (Load Playlist)
                </button>
              </form>

              <div className="p-3 rounded-lg bg-black/40 border border-amber-900/30 text-[11px] text-stone-400 space-y-1">
                <span className="text-amber-400 font-mono font-bold block">Example URLs:</span>
                <p className="break-all font-mono text-[10px] text-amber-300/70">
                  PLO6WOx_nE9ULl-FgE0NPR4c6BSu-1-CPJ
                </p>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};
