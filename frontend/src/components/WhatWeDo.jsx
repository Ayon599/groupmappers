import { Database, LineChart, Map, Share2 } from 'lucide-react';

const items = [
  {
    title: 'Data collection & management',
    icon: Database,
    body: 'Collection and management of geospatial data using key informant interviews, participatory rural appraisals, ODK, Kobo Toolbox, SMS, and custom geo-referencing systems.'
  },
  {
    title: 'Data analysis & modeling',
    icon: LineChart,
    body: 'Spatial interpolation, overlay analysis, physical accessibility analysis, and spatial statistics for public-health decision support.'
  },
  {
    title: 'Mapping and visualization',
    icon: Map,
    body: 'Interactive web maps, tailored thematic maps, custom styles, and visualizations that make spatial information understandable.'
  },
  {
    title: 'Data dissemination',
    icon: Share2,
    body: 'Support for publishing, sharing, and implementing data access policies so stakeholders can use geospatial data effectively.'
  }
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="bg-slate-50 py-20 lg:py-28">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-gm-navy lg:text-5xl">
            Geospatial solutions for public health.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            By utilizing a geospatial approach, GroupMappers develops innovative solutions to understand disease distribution, identify high-risk areas, and improve public-health interventions.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gm-mint text-gm-green">
                <Icon size={27} />
              </span>
              <h3 className="mt-6 text-xl font-black tracking-[-0.025em] text-gm-navy">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
