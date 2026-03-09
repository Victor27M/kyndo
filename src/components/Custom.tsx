import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { STAGGER_CONTAINER, FADE_SLIDE_UP, VIEWPORT_SETTINGS } from '@/data/animations';

export default function Custom(): React.JSX.Element {
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

          <motion.h2 className="custom__headline" variants={FADE_SLIDE_UP}>
            Your space is specific. Your lamp should be too.
          </motion.h2>

          <motion.p className="custom__lead" variants={FADE_SLIDE_UP}>
            The catalogue is a starting point. If you already have something in mind that doesn't exist on it — a colour, a proportion, a finish that matches something else in your room — this is where to start.
          </motion.p>

          <motion.p className="custom__text" variants={FADE_SLIDE_UP}>
            Custom orders at Kyndo work like a conversation, not a configuration tool. You fill in a form with roughly what you're imagining — dimensions, colours, context, references — and I'll follow up directly, by email or phone, to go through the details together.
          </motion.p>

          <motion.p className="custom__text" variants={FADE_SLIDE_UP}>
            I'll be honest about what's possible and realistic about timelines. I'll tell you if an idea won't work before we go further. Pricing is based on design time — a simple colour change costs differently than a shape designed from scratch — and we'll agree on it before anything gets made.
          </motion.p>

          <motion.p className="custom__text" variants={FADE_SLIDE_UP}>
            The only limit is physics. Colours, proportions, finishes, combinations — open. Unicorns — let's talk.
          </motion.p>

          <motion.div className="custom__cta" variants={FADE_SLIDE_UP}>
            <Link to="/notify" className="btn btn--solid">
              Tell me what you're imagining →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
