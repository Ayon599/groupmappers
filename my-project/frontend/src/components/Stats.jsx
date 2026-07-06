const stats = [
  ['20', 'Core Experts'],
  ['19', 'Regular Employees'],
  ['50+', 'Active Volunteers'],
  ['6', 'Ongoing Projects']
];

export default function Stats() {
  return (
    <section className="bg-gm-navy py-20 text-white">
      <div className="section-shell">
        <p className="text-center text-xs font-black uppercase tracking-[0.24em] text-gm-sky">By the number</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-[1.75rem] border border-white/10 bg-white/8 p-8 text-center backdrop-blur">
              <strong className="block text-5xl font-black tracking-[-0.05em]">{value}</strong>
              <span className="mt-3 block text-sm font-bold text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
