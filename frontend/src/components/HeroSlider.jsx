import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function HeroSlider({ images }) {
  const slides = useMemo(() => {
    return [
      {
        src: images['hero-volunteer'] || images.hero,
        alt: 'GroupMappers volunteer showcase',
        label: 'Community Volunteers'
      },
      {
        src: images['group-photo-1'] || images['who-we-are'] || images.whoWeAre,
        alt: 'GroupMappers field mapping group',
        label: 'Field Mapping'
      },
      {
        src: images['group-photo-2'] || images['mission-community'] || images.mission,
        alt: 'GroupMappers public health activity',
        label: 'Public Health Mapping'
      },
      {
        src: images['volunteer-activity-1'] || images.volunteer1,
        alt: 'GroupMappers volunteer activity',
        label: 'Volunteer Action'
      }
    ].filter((slide) => Boolean(slide.src));
  }, [images]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[active] || slides[0];

  function goPrevious() {
    setActive((currentIndex) => (currentIndex + slides.length - 1) % slides.length);
  }

  function goNext() {
    setActive((currentIndex) => (currentIndex + 1) % slides.length);
  }

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-soft">
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <img
          src={current.src}
          alt={current.alt}
          className="h-[420px] w-full object-cover transition-opacity duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gm-navy/55 via-transparent to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
          <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-black text-gm-navy shadow backdrop-blur">
            {current.label}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gm-navy shadow transition hover:bg-white"
              aria-label="Previous image"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gm-navy shadow transition hover:bg-white"
              aria-label="Next image"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${slide.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${
                active === index ? 'w-8 bg-white' : 'w-2 bg-white/55'
              }`}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {slides.map((slide, index) => (
          <button
            key={`thumb-${slide.src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              active === index ? 'border-gm-sky' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            aria-label={`Open thumbnail ${index + 1}`}
          >
            <img src={slide.src} alt="" className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
