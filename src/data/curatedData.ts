import { CuratedCategory, VideoItem } from '../types';

export const DEFAULT_CURATED_COLLECTIONS: CuratedCategory[] = [
  {
    category: 'Mathematics & Calculus',
    icon: 'Calculator',
    description: 'Intuition-first visual calculus, linear algebra, and differential equations.',
    videos: [
      {
        id: 'WUvTyaaNkzM',
        title: 'The Essence of Calculus - Chapter 1',
        channelTitle: '3Blue1Brown',
        duration: '17:04',
        topic: 'Calculus',
        description: 'What does area under a curve have to do with slopes of tangents? The core intuition behind calculus.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'fNk_zzaMoSs',
        title: 'Essence of Linear Algebra - Vectors and Bases',
        channelTitle: '3Blue1Brown',
        duration: '09:52',
        topic: 'Linear Algebra',
        description: 'Geometric understanding of vectors, spans, and linear combinations without overwhelming notation.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: '1xZCgC_5n_w',
        title: 'Calculus 1 - Full College Course Overview',
        channelTitle: 'freeCodeCamp.org',
        duration: '11:47:00',
        topic: 'Calculus',
        description: 'Limits, continuity, derivatives, and applications designed for university examination review.',
        thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    category: 'Computer Science & Engineering',
    icon: 'Cpu',
    description: 'Data structures, operating systems, and computer architecture visual explanations.',
    videos: [
      {
        id: 'RBSGKlAvoiM',
        title: 'Data Structures and Algorithms for Beginners',
        channelTitle: 'freeCodeCamp.org',
        duration: '02:40:00',
        topic: 'Data Structures',
        description: 'Arrays, Linked Lists, Trees, Graphs, and Hash Maps explained with step-by-step memory diagrams.',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: '8aGhZQkoFbQ',
        title: 'Event Loop in JavaScript - Visual Guide',
        channelTitle: 'JSConf',
        duration: '26:52',
        topic: 'Operating Systems & Concurrency',
        description: 'Philip Roberts explains the call stack, web APIs, event loop, and task queues clearly.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'k6U-i4gXka8',
        title: 'Computer Architecture - Crash Course Computer Science',
        channelTitle: 'CrashCourse',
        duration: '11:43',
        topic: 'Computer Architecture (COA)',
        description: 'From logic gates and ALUs to modern register files and control units.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    category: 'Physics & Intuitive Science',
    icon: 'Atom',
    description: 'Quantum mechanics, electromagnetism, and classical physics.',
    videos: [
      {
        id: '7KB3yq3Vj9I',
        title: 'Quantum Computing in 10 Minutes',
        channelTitle: 'Domain of Science',
        duration: '10:00',
        topic: 'Quantum Physics',
        description: 'Superposition, entanglement, and qubits explained with geometric bloch sphere animations.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'd9b7p98Q4-s',
        title: 'Special Relativity: Time Dilation & Spacetime Diagrams',
        channelTitle: 'minutephysics',
        duration: '12:15',
        topic: 'Physics',
        description: 'Visualizing spacetime intervals, light cones, and Lorentz transformations.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    category: 'Deep Focus & Ambient Study Beats',
    icon: 'Headphones',
    description: 'Binaural beats, alpha brain waves, and lo-fi audio to induce effortless flow state.',
    videos: [
      {
        id: 'jfKfPfyJRdk',
        title: 'lofi hip hop radio - beats to relax/study to',
        channelTitle: 'Lofi Girl',
        duration: 'Live Stream',
        topic: 'Deep Focus',
        description: 'Smooth calming background melodies to drown out external distractions during exam cram sessions.',
        thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: '5qap5aO4i9A',
        title: 'lofi hip hop radio - beats to sleep/chill to',
        channelTitle: 'Lofi Girl',
        duration: 'Live Stream',
        topic: 'Deep Focus',
        description: 'Soft ambient lo-fi textures for quiet late-night study and revision sessions.',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
];

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
