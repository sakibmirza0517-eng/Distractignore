import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Play, Bookmark, Clock, Sparkles } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoCard3DProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (video: VideoItem) => void;
  isActive?: boolean;
}

export const VideoCard3D: React.FC<VideoCard3DProps> = ({
  video,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isActive = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Motion Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02, z: 20 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative rounded-2xl overflow-hidden bg-white/5 hover:bg-white/[0.08] border transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-md ${
        isActive
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/40'
          : 'border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10'
      }`}
      onClick={() => onSelect(video)}
      id={`video-card-${video.id}`}
    >
      {/* 3D Depth Layer */}
      <div 
        style={{ transform: 'translateZ(30px)' }} 
        className="relative aspect-video w-full overflow-hidden bg-black"
      >
        <img
          src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Duration pill */}
        {video.duration && (
          <div 
            style={{ transform: 'translateZ(40px)' }}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-medium text-white/80 flex items-center gap-1 border border-white/10"
          >
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{video.duration}</span>
          </div>
        )}

        {/* Topic Tag */}
        {video.topic && (
          <div 
            style={{ transform: 'translateZ(40px)' }}
            className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md text-[10px] font-mono font-medium tracking-wide text-blue-400 uppercase"
          >
            {video.topic}
          </div>
        )}

        {/* Bookmark Quick Toggle */}
        <button
          id={`bookmark-btn-${video.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(video);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isBookmarked
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 border border-blue-400/50'
              : 'bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10'
          }`}
          title={isBookmarked ? 'Bookmarked for Exam' : 'Bookmark for Exam'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Play Icon Hover Overlay with Immersive design */}
        <div 
          style={{ transform: 'translateZ(50px)' }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-blue-600/30 group-hover:border-blue-500/50 shadow-xl transition-all">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        style={{ transform: 'translateZ(20px)' }}
        className="p-4 space-y-2"
      >
        <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-white/60 pt-1">
          <span className="font-normal text-white/70 truncate max-w-[170px]">
            {video.channelTitle}
          </span>
          <span className="text-[11px] text-blue-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ad-Free
          </span>
        </div>

        {video.description && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed pt-1">
            {video.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};
