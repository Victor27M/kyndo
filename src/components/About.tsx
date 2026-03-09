import { motion } from 'framer-motion';
import { STAGGER_CONTAINER, FADE_SLIDE_UP, VIEWPORT_SETTINGS } from '@/data/animations';

export default function About(): React.JSX.Element {
  return (
    <section id="about" className="about" aria-label="About Kyndo">
      <div className="container">
        <motion.div
          className="about__stack"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_SETTINGS}
        >
          <motion.h3 className="about__title" variants={FADE_SLIDE_UP}>
            About Kyndo
          </motion.h3>

          <motion.p className="about__lead" variants={FADE_SLIDE_UP}>
            Minimal forms, warm presence. We build long-lived objects you can repair, not
            replace.
          </motion.p>

          <motion.p className="about__text" variants={FADE_SLIDE_UP}>
            Each lamp is designed to be modular and serviceable. Cables, diffusers, and
            printed parts can be swapped or upgraded so your light adapts to your space
            over time while keeping a restrained, timeless silhouette.
          </motion.p>

          <motion.div
            className="about__modularity"
            variants={FADE_SLIDE_UP}
            aria-hidden="true"
          >
            <div className="about__modularity-placeholder" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
