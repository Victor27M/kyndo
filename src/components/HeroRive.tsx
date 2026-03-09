import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import lampRiv from '@/assets/lamp_assembly_png_bg.riv?url';

interface RiveConfig {
  ARTBOARD?: string;
  STATE_MACHINE?: string;
  REPLAY_INPUT?: string;
  ANIMATION?: string;
}

const RIVE_CONFIG: RiveConfig = {
  ARTBOARD: undefined,
  STATE_MACHINE: 'State Machine 1',
  REPLAY_INPUT: 'Replay',
  ANIMATION: 'Assemble',
};

export default function HeroRive(): React.JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.5, once: true });

  const prefersReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const buildRiveOptions = useCallback(
    () => {
      interface RiveOptions {
        src: string;
        autoplay: boolean;
        artboard?: string;
        stateMachines?: string[];
        animations?: string[];
      }

      const options: RiveOptions = {
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
    },
    [prefersReducedMotion]
  );

  const riveOpts = buildRiveOptions();
  const { RiveComponent, rive } = useRive(riveOpts as Parameters<typeof useRive>[0]);

  const replayInput =
    RIVE_CONFIG.STATE_MACHINE &&
    useStateMachineInput(rive, RIVE_CONFIG.STATE_MACHINE, RIVE_CONFIG.REPLAY_INPUT || '');

  useEffect(() => {
    if (!rive || prefersReducedMotion()) return;

    if (!RIVE_CONFIG.STATE_MACHINE && !RIVE_CONFIG.ANIMATION) {
      rive.play();
    }
  }, [rive, prefersReducedMotion]);

  useEffect(() => {
    if (!rive || prefersReducedMotion() || !inView) return;

    if (RIVE_CONFIG.STATE_MACHINE && replayInput && 'fire' in replayInput) {
      replayInput.fire();
    } else if (!RIVE_CONFIG.STATE_MACHINE && RIVE_CONFIG.ANIMATION) {
      rive.reset();
      rive.play(RIVE_CONFIG.ANIMATION);
    } else if (!RIVE_CONFIG.STATE_MACHINE && !RIVE_CONFIG.ANIMATION) {
      rive.reset();
      rive.play();
    }
  }, [rive, inView, prefersReducedMotion, replayInput]);

  return (
    <section className="hero__rive" ref={stageRef}>
      {RiveComponent && <RiveComponent />}
    </section>
  );
}
