/**
 * Framer Motion Animation Variants
 * Centralized animation definitions used across multiple components
 */

/**
 * Staggered container animation
 * Used in sections that have multiple animated children
 */
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      when: 'beforeChildren',
    },
  },
};

/**
 * Fade and slide-up item animation
 * Used for individual items within staggered containers
 */
export const FADE_SLIDE_UP = {
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

/**
 * Default animation viewport settings
 * Applied to motion.div elements that trigger animations on scroll
 */
export const VIEWPORT_SETTINGS = {
  once: true,
  amount: 0.35,
};
