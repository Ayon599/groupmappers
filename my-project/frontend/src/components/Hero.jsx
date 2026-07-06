import { ArrowRight, MapPinned, UsersRound } from 'lucide-react';
import HeroSlider from './HeroSlider.jsx';

export default function Hero({ images }) {
  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dff7ff,_transparent_38%),linear-gradient(135deg,#f8fcff,#eef9f4)] py-20 lg:py-28">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow">Bangladesh-based mapmakers</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-gm-navy sm:text-6xl lg:text-7xl">
            Crowdsourced mapping for stronger public health outcomes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            GroupMappers uses geospatial technology, volunteer action, and public-health data to map villages, disease risk, accessibility, and community needs across Bangladesh.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#about-us" className="inline-flex items-center gap-2 rounded-full bg-gm-navy px-6 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5">
              Learn who we are <ArrowRight size={18} />
            </a>
            <a href="#what-we-do" className="inline-flex items-center gap-2 rounded-full border border-gm-sky/30 bg-white px-6 py-4 text-sm font-black text-gm-blue transition hover:border-gm-sky">
              Explore activities
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-9 z-10 rounded-3xl bg-white p-5 shadow-soft">
            <UsersRound className="text-gm-green" />
            <strong className="mt-2 block text-2xl font-black text-gm-navy">50+</strong>
            <span className="text-xs font-bold text-slate-500">Active Volunteers</span>
          </div>
          <HeroSlider images={images} />
          <div className="absolute -bottom-7 right-6 z-10 flex items-center gap-3 rounded-3xl bg-gm-navy px-5 py-4 text-white shadow-soft">
            <MapPinned className="text-gm-sky" />
            <span className="text-sm font-bold">Village mapping since 2017</span>
          </div>
        </div>
      </div>
    </section>
  );
}
