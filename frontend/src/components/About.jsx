import { PlayCircle, Target, Users } from 'lucide-react';

export default function About({ images }) {
  return (
    <section id="about-us" className="bg-white py-20 lg:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-gm-navy lg:text-5xl">
            A group of Bangladesh-based mapmakers.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            GroupMappers is a Bangladeshi crowdsourcing initiative that utilizes geospatial technology for public health issues. Established in 2017, it is led by the Mahidol Oxford Tropical Medicine Research Unit and the Communicable Disease Control division of the DGHS in Bangladesh.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-gm-mint p-6">
              <Users className="text-gm-green" />
              <h3 className="mt-4 font-black text-gm-navy">Volunteer powered</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Young mapmakers contribute to practical public-health projects.</p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-6">
              <Target className="text-gm-sky" />
              <h3 className="mt-4 font-black text-gm-navy">Mission focused</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Empowering communities through crowdsourced mapping and data analysis.</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gm-navy p-3 shadow-soft">
          <img src={images['who-we-are'] || images.whoWeAre} alt="GroupMappers volunteers working together" className="h-[520px] w-full rounded-[1.5rem] object-cover opacity-90" />
          <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-white/90 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <PlayCircle className="text-gm-sky" size={42} />
              <div>
                <strong className="text-gm-navy">Mission</strong>
                <p className="text-sm text-slate-600">Empowering communities through crowdsourced mapping and data analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
