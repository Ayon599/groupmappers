const domains = [
  {
    title: 'Data collection & management',
    body: 'The GroupMappers team has extensive expertise in both collection and management of geospatial data. They utilize a variety of methods to gather information, including key informant interviews, participatory rural appraisals, and surveys using tools such as ODK, Kobo Toolbox, and SMS.'
  },
  {
    title: 'Data analysis & modeling',
    body: 'Spatial analysis and modeling are integral to GroupMapper’s work, particularly physical accessibility analysis. Their experience includes utilizing geospatial data to perform spatial interpolation, overlay analysis, and spatial statistics.'
  },
  {
    title: 'Mapping and visualization',
    body: 'GroupMappers excel in developing interactive web maps and visualizations that convey geospatial information to end-users. Expertise includes building web mapping applications, creating customized map styles, and integrating data from multiple sources.'
  },
  {
    title: 'Data dissemination and sharing',
    body: 'GroupMappers provides support for making geospatial data accessible to stakeholders and end-users. This support includes data publishing, sharing, and implementation of data access policies.'
  }
];

const projects = [
  ['Village Mapping', '2017-ongoing', 'Malaria', 'group-photo-1'],
  ['G6PD Testing for Malaria Treatment', '2022-ongoing', 'Malaria', 'group-photo-2'],
  ['Piloting Village-level Malaria Surveillance in Lama, Bandarban', '2022', 'Malaria', 'group-photo-3'],
  ['Malaria API Tracker', '2021', 'Malaria', 'malariaTracker'],
  ['Crisis Ready Project (CRP)', '2022', 'Covid-19', 'showcase'],
  ['Mask Study', '2021', 'Covid-19', 'covidMask'],
  ['Covid-19 Risk Zoning', '2020', 'Covid-19', 'showcase'],
  ['Dengue Risk Tracker', '2021', 'Dengue', 'who-we-are'],
  ['Dengue Household Survey', '2019', 'Dengue', 'group-photo-4'],
  ['Mass Dog Vaccination Program', '2018-Ongoing', 'Rabies', 'rabies'],
  ['The Global Health Facilities Database (GHFD)', '2020-ongoing', 'Non Diseases', 'showcase']
];

export default function Projects({ images }) {
  return (
    <main className="bg-slate-50">
      <section className="section-shell py-20 lg:py-28">
        <p className="eyebrow">Projects</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
          Public-health mapping projects across disease and non-disease domains.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          By utilizing a geospatial approach, GroupMappers develops innovative solutions to understand disease distribution, identify high-risk areas, and improve the targeting and delivery of public health interventions.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {domains.map((domain) => (
            <article key={domain.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black text-gm-navy">{domain.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{domain.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Project list</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(([title, year, category, imageKey]) => (
              <article key={title} id={title.toLowerCase().replaceAll(' ', '-')} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <img
                  src={images[imageKey] || images.hero}
                  alt={title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <span className="rounded-full bg-gm-mint px-3 py-1 text-xs font-black text-gm-green">{category}</span>
                  <h3 className="mt-4 text-xl font-black text-gm-navy">{title}</h3>
                  <p className="mt-2 text-sm font-bold text-slate-500">{year}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
