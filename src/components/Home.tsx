import HeroRive from '@/components/HeroRive';
import Store from '@/components/Store';
import About from '@/components/About';

export default function Home(): React.JSX.Element {
  return (
    <>
      <HeroRive />
      <Store />
      <About />
    </>
  );
}
