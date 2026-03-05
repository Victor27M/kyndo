import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { STAGGER_CONTAINER, FADE_SLIDE_UP, VIEWPORT_SETTINGS } from '../data/animations.js';

/**
 * Custom Component
 * Page showcasing custom order capabilities
 * Uses staggered animations on scroll for visual interest
 */
export default function Custom() {
  return (
    <section id="custom" className="custom" aria-label="Custom Orders">
      <div className="container">
        <motion.div
          className="custom__stack"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_SETTINGS}
        >
          <motion.h1 className="custom__title" variants={FADE_SLIDE_UP}>
            Custom Orders
          </motion.h1>

          <motion.p className="custom__lead" variants={FADE_SLIDE_UP}>
            Looking for something unique? We offer custom configurations and bespoke
            designs.
          </motion.p>

          <motion.p className="custom__text" variants={FADE_SLIDE_UP}>
            Each custom project starts with a conversation about your space, your needs,
            and your aesthetic preferences. We'll work with you to design and build a lamp
            that's truly one-of-a-kind.
          </motion.p>

          <motion.div className="custom__cta" variants={FADE_SLIDE_UP}>
            <Link to="/notify" className="btn btn--solid">
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
