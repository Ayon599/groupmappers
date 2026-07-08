import { newsItems } from '../data/siteContent.js';

export default function LatestNews() {
  return (
    <main className="bg-slate-50 py-20 lg:py-28">
      <div className="section-shell">
        <p className="eyebrow">Latest News</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
          Updates from GroupMappers projects, workshops, and public-health mapping work.
        </h1>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {newsItems.map(([date, title]) => (
            <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-black text-gm-sky">{date}</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-gm-navy">{title}</h2>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
