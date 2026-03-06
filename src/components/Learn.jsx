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
            Objects made to live with.
          </motion.h1>

          <motion.p className="learn__lead" variants={FADE_SLIDE_UP}>
            Designed from scratch. Printed in-house. Built for spaces that take aesthetics seriously.
          </motion.p>

          <motion.div className="learn__section" variants={FADE_SLIDE_UP}>
            <h2 className="learn__subtitle">Why Kyndo exists</h2>
            <p className="learn__text">
              The objects you live with every day shape how a space feels — and most of what's available is either too expensive to justify or too generic to care about. Kyndo was built to sit between those two things. Each piece is designed with intention, produced without a factory, and priced for people who take their spaces seriously but don't have a gallery budget.
            </p>
          </motion.div>

          <motion.div className="learn__section" variants={FADE_SLIDE_UP}>
            <h2 className="learn__subtitle">How it's made</h2>
            <p className="learn__text">
              Every Kyndo lamp starts as a 3D model — refined until the proportions feel right and nothing feels arbitrary. From there it goes straight to print. No tooling. No minimum orders. No intermediaries between the design and the finished object.
            </p>
            <p className="learn__text">
              This process matters because it changes what's possible. A shape can be tested, adjusted, and reprinted in hours. A colorway can exist as a single piece. A design that wouldn't survive a factory pipeline can make it to your shelf. The printer isn't a constraint — it's the reason Kyndo can exist at all.
            </p>
          </motion.div>

          <motion.div className="learn__section" variants={FADE_SLIDE_UP}>
            <h2 className="learn__subtitle">What it's made from</h2>
            <p className="learn__text">
              Every piece is printed from PLA — a filament derived from renewable plant sources, not petroleum. The choice has consequences: a surface that catches light differently than injection-moulded plastic, a slight warmth to the touch, and a significantly smaller environmental footprint than conventional alternatives.
            </p>
            <p className="learn__text">
              Sustainability at Kyndo isn't a section in the footer. It's a material decision made at the start of every design.
            </p>
          </motion.div>

          <motion.p className="learn__closing" variants={FADE_SLIDE_UP}>
            Each order arrives as a kit — printed parts, a premium textile cable, and a bulb. Assembly takes under five minutes. Everything you need is included.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
