import { newsItems } from '../data/siteContent.js';

export default function GroupLetters() {
  return (
    <main className="bg-white py-20 lg:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">GroupLetters</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            Newsletter writing and communication from the GroupMappers community.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Volunteers contribute by writing for newsletters and communicating the impact of mapping, field data, and public-health projects.
          </p>
        </div>
        <div className="grid gap-4">
          {newsItems.slice(0, 5).map(([date, title]) => (
            <article key={title} className="rounded-[1.5rem] border border-slate-200 p-6">
              <p className="text-xs font-black text-gm-sky">{date}</p>
              <h2 className="mt-2 text-xl font-black text-gm-navy">{title}</h2>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
