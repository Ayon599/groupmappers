const activities = [
  {
    title: 'Volunteerism and Support',
    imageKey: 'volunteer-activity-1',
    body: 'As a crowdsourcing initiative, GroupMappers values the power of volunteerism and engages young individuals who share a passion for exploring the world of geospatial techniques and public health. This provides an opportunity for individuals to participate in action-oriented and impactful activities.'
  },
  {
    title: 'Mapping',
    imageKey: 'group-photo-1',
    body: 'Volunteers can choose to participate in segments that align with their interests, such as working for mapping activities that support public-health interventions.'
  },
  {
    title: 'Newsletter writing',
    imageKey: 'showcase',
    body: 'Volunteers can contribute by writing for newsletters and communicating the impact of GroupMappers mapping, field data, and public-health projects.'
  },
  {
    title: 'GroupLetters',
    imageKey: 'showcase',
    href: '/groupletters',
    body: 'GroupLetters share field updates, training notes, and stories from GroupMappers community work.'
  },
  {
    title: 'GIS/RS club cafes',
    imageKey: 'group-photo-3',
    body: 'Volunteers can conduct sessions in GIS/RS club cafes, sharing technical knowledge in geospatial techniques, mapping, and public health.'
  },
  {
    title: 'Fundraising',
    imageKey: 'fundraising',
    body: 'Volunteers can support fund raising efforts that help improve public health in Bangladesh, particularly in remote areas like Bandarban.'
  }
];

export default function Activities({ images }) {
  return (
    <main className="bg-white">
      <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div>
          <p className="eyebrow">Activities</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            Volunteerism, workshops, mapping, fundraising, and GroupLetters.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            GroupMappers provides opportunities for young people to participate in action-oriented and impactful activities in geospatial techniques and public health.
          </p>
        </div>
        <img
          src={images['volunteer-activity-1'] || images['group-photo-1'] || images['hero-volunteer']}
          alt="GroupMappers volunteers"
          className="h-[460px] w-full rounded-[2rem] object-cover shadow-soft"
        />
      </section>

      <section className="bg-slate-50 py-20">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          {activities.map((activity) => (
            <article key={activity.title} id={activity.title.toLowerCase().replaceAll('/', '-').replaceAll(' ', '-')} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <img
                src={images[activity.imageKey] || images.hero}
                alt={activity.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-7">
                <h2 className="text-2xl font-black text-gm-navy">{activity.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{activity.body}</p>
                {activity.href && <a href={activity.href} className="mt-5 inline-flex text-sm font-black text-gm-sky">Open page</a>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
