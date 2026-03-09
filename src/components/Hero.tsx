import { motion } from 'framer-motion';

export default function Hero(): React.JSX.Element {
  return (
    <section className="section hero" aria-label="Hero">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18, mass: 0.6 }}
        className="container hero__inner"
      >
        <h1 className="hero__title">Design the light you live by.</h1>
        <p className="hero__subtitle">
          Minimal forms, warm presence. Crafted for quiet, intentional spaces.
        </p>
      </motion.div>
    </section>
  );
}
