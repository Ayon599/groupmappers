const team = [
  ['20', 'Core Experts'],
  ['19', 'Regular Employees'],
  ['50+', 'Active Volunteers'],
  ['6', 'Ongoing Projects']
];

export default function TeamMembers({ images }) {
  return (
    <main className="bg-slate-50">
      <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div>
          <p className="eyebrow">Team Members</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            A multidisciplinary team of mapmakers, analysts, and public-health collaborators.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            GroupMappers combines GIS aptitude, field experience, volunteer coordination, research support, and geospatial technology to address public-health issues in Bangladesh.
          </p>
        </div>
        <img src={images.showcase || images.hero} alt="GroupMappers team members" className="h-[480px] w-full rounded-[2rem] object-cover shadow-soft" />
      </section>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-5 md:grid-cols-4">
          {team.map(([value, label]) => (
            <article key={label} className="rounded-[1.75rem] border border-slate-200 p-7 text-center">
              <strong className="text-5xl font-black text-gm-navy">{value}</strong>
              <p className="mt-3 text-sm font-black text-slate-500">{label}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
