const founders = [
  {
    name: 'Richard Maude',
    role: 'Head of Epidemiology',
    imageKey: 'richard',
    body: 'Professor Maude is Head of the Epidemiology Department at Mahidol-Oxford Tropical Medicine Research Unit, Bangkok, Thailand. His research combines clinical studies, descriptive epidemiology and mathematical modelling of human diseases.'
  },
  {
    name: 'Ipsita Sinha',
    role: 'Research Physician',
    imageKey: 'sinha',
    body: 'Dr Ipsita Sinha is part of the Epidemiology department at MORU, and a Research Physician in Tropical Medicine at the University of Oxford. She is also an honorary medical registrar at the John Radcliffe Hospital in Oxford.'
  },
  {
    name: 'Sazid Ibna Zaman',
    role: 'Data Manager & GIS Specialist',
    imageKey: 'sazid',
    body: 'Based in Dhaka, Bangladesh, Sazid Ibna Zaman is a Data Manager & GIS Specialist for the MORU Epidemiology departments at the Mahidol Oxford Tropical Medicine Research Unit (MORU), Bangkok, Thailand.'
  }
];

export default function About({ images }) {
  return (
    <main className="bg-white">
      <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:py-28">
        <div>
          <p className="eyebrow">About Us</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            As our name suggests, we are a group of Bangladesh-based mapmakers.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            GroupMappers is a Bangladeshi crowdsourcing initiative that utilizes geospatial technology for public health issues. Established in 2017, it is led by the Mahidol Oxford Tropical Medicine Research Unit and the Communicable Disease Control division of the DGHS in Bangladesh.
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The organization’s 20 core members possess a strong GIS aptitude and diverse backgrounds in education and professional experience. Starting with village mapping, our success in the field has continued to grow.
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            GroupMappers supports humanitarian and public-health mapping by combining crowdsourced mapping, data analysis, field knowledge, and volunteer action to improve public health outcomes.
          </p>
          <div className="mt-8 rounded-[2rem] bg-gm-mint p-7">
            <p className="eyebrow">Mission</p>
            <blockquote className="mt-3 text-2xl font-black leading-snug tracking-[-0.03em] text-gm-navy">
              “Empowering communities through the utilization of crowdsourced mapping and data analysis for enhanced public health outcomes.”
            </blockquote>
          </div>
        </div>
        <img
          src={images['who-we-are'] || images.whoWeAre}
          alt="GroupMappers team"
          className="h-[540px] w-full rounded-[2rem] object-cover shadow-soft"
        />
      </section>

      <section className="bg-slate-50 py-20">
        <div className="section-shell">
          <p className="eyebrow">Founders</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-gm-navy">Founders and leadership</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {founders.map((founder) => (
              <article key={founder.name} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                {images[founder.imageKey] ? (
                  <img
                    src={images[founder.imageKey]}
                    alt={founder.name}
                    className="h-72 w-full object-cover object-top"
                  />
                ) : (
                  <div className="m-7 grid h-16 w-16 place-items-center rounded-2xl bg-gm-navy text-xl font-black text-white">
                    {founder.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                )}
                <div className="p-7">
                <h3 className="mt-6 text-2xl font-black text-gm-navy">{founder.name}</h3>
                <p className="mt-1 text-sm font-black text-gm-sky">{founder.role}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{founder.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
