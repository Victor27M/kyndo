import type { FramerMotionVariants, ViewportSettings } from '@/types';

export const STAGGER_CONTAINER: FramerMotionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      when: 'beforeChildren',
    },
  },
};

export const FADE_SLIDE_UP: FramerMotionVariants = {
  hidden: { opacity: 0, y: 38 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const VIEWPORT_SETTINGS: ViewportSettings = {
  once: true,
  amount: 0.35,
};
