import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import lampRiv from '../assets/lamp_assembly_png_bg.riv?url';

/**
 * Rive Animation Configuration
 * Set these values to match your .riv file (from Rive editor sidebar)
 */
const RIVE_CONFIG = {
  ARTBOARD: undefined, // Optional artboard name
  STATE_MACHINE: 'State Machine 1', // State machine name or null
  REPLAY_INPUT: 'Replay', // Trigger/boolean input name
  ANIMATION: 'Assemble', // Timeline animation name if no state machine
};

/**
 * HeroRive Component
 * Displays an animated Rive lamp assembly that plays when in view
 * Respects prefers-reduced-motion for accessibility
 */
export default function HeroRive() {
  const stageRef = useRef(null);
  const inView = useInView(stageRef, { amount: 0.5, once: true });

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  // Build Rive options dynamically
  const buildRiveOptions = useCallback(() => {
    const options = {
      src: lampRiv,
      autoplay: !prefersReducedMotion(),
    };

    if (RIVE_CONFIG.ARTBOARD) {
      options.artboard = RIVE_CONFIG.ARTBOARD;
    }
    if (RIVE_CONFIG.STATE_MACHINE) {
      options.stateMachines = [RIVE_CONFIG.STATE_MACHINE];
    } else if (RIVE_CONFIG.ANIMATION) {
      options.animations = [RIVE_CONFIG.ANIMATION];
    }

    return options;
  }, [prefersReducedMotion]);

  const riveOpts = buildRiveOptions();
  const { RiveComponent, rive } = useRive(riveOpts);

  // Get state machine input if available
  const replayInput =
    RIVE_CONFIG.STATE_MACHINE &&
    useStateMachineInput(rive, RIVE_CONFIG.STATE_MACHINE, RIVE_CONFIG.REPLAY_INPUT || '');

  // Initialize animation on load
  useEffect(() => {
    if (!rive || prefersReducedMotion()) return;

    if (!RIVE_CONFIG.STATE_MACHINE && !RIVE_CONFIG.ANIMATION) {
      rive.play(); // Play all animations
    }
  }, [rive, prefersReducedMotion]);

  // Trigger animation when element comes into view
  useEffect(() => {
    if (!rive || prefersReducedMotion() || !inView) return;

    if (RIVE_CONFIG.STATE_MACHINE && replayInput && 'fire' in replayInput) {
      replayInput.fire(); // Trigger state machine
    } else if (!RIVE_CONFIG.STATE_MACHINE && RIVE_CONFIG.ANIMATION) {
      rive.reset();
      rive.play(RIVE_CONFIG.ANIMATION); // Play timeline
    } else if (!RIVE_CONFIG.STATE_MACHINE && !RIVE_CONFIG.ANIMATION) {
      rive.reset();
      rive.play(); // Fallback
    }
  }, [inView, rive, replayInput, prefersReducedMotion]);

  return (
    <section className="section hero hero--assemble" aria-label="Hero Animation">
      <div className="container heroA__grid">
        {/* Hero text content */}
        <div className="hero__copy">
          <h1 className="hero__title">Design the light you live by.</h1>
          <p className="hero__subtitle">
            Minimal forms, warm presence. Crafted for quiet, intentional spaces.
          </p>
        </div>

        {/* Rive animation canvas */}
        <div ref={stageRef} className="heroA__stage heroA__stage--fixedheight">
          <RiveComponent className="rive-lamp" />
        </div>
      </div>
    </section>
  );
}
