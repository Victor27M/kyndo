import { motion } from 'framer-motion';
import { STAGGER_CONTAINER, FADE_SLIDE_UP, VIEWPORT_SETTINGS } from '../data/animations.js';

/**
 * Learn Component
 * Informational page about Kyndo's design philosophy and sustainability
 * Uses staggered animations on scroll for visual interest
 */
export default function Learn() {
  return (
    <section id="learn" className="learn" aria-label="Learn About Kyndo">
      <div className="container">
        <motion.div
          className="learn__stack"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_SETTINGS}
        >
          <motion.h1 className="learn__title" variants={FADE_SLIDE_UP}>
            About Kyndo
          </motion.h1>

          <motion.p className="learn__lead" variants={FADE_SLIDE_UP}>
            Minimal forms, warm presence. We build long-lived objects you can repair, not
            replace.
          </motion.p>

          <motion.p className="learn__text" variants={FADE_SLIDE_UP}>
            Each lamp is designed to be modular and serviceable. Cables, diffusers, and
            printed parts can be swapped or upgraded so your light adapts to your space
            over time while keeping a restrained, timeless silhouette.
          </motion.p>

          <motion.div className="learn__section" variants={FADE_SLIDE_UP}>
            <h2 className="learn__subtitle">Design Philosophy</h2>
            <p className="learn__text">
              We believe in designing products that last. Not through built-in
              obsolescence, but through thoughtful engineering and easy repairability.
              Every component is chosen to be durable, and every assembly is designed to
              be serviceable.
            </p>
          </motion.div>

          <motion.div className="learn__section" variants={FADE_SLIDE_UP}>
            <h2 className="learn__subtitle">Sustainable Practices</h2>
            <p className="learn__text">
              From our material selection to our manufacturing partners, we prioritize
              sustainability without compromising on quality. Our lamps are built to be
              repaired and upgraded, reducing waste and extending their lifecycle.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
