import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Stats from '../components/Stats.jsx';
import WhatWeDo from '../components/WhatWeDo.jsx';

export default function HomePage({ images }) {
  return (
    <main>
      <Hero images={images} />
      <About images={images} />
      <WhatWeDo />
      <Stats />
    </main>
  );
}
