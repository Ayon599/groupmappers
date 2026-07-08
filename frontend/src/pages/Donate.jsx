import { HeartHandshake, Mail, MapPin, Phone } from 'lucide-react';

export default function Donate({ images }) {
  return (
    <main className="bg-slate-50">
      <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div>
          <p className="eyebrow">Donate Us</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            Support GroupMappers fundraising and public-health mapping work.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Your contribution helps GroupMappers continue community mapping, volunteer engagement, training, and public-health data initiatives across Bangladesh.
          </p>
          <div className="mt-8 rounded-[2rem] bg-white p-7 shadow-soft">
            <h2 className="flex items-center gap-3 text-2xl font-black text-gm-navy">
              <HeartHandshake className="text-gm-green" />
              Choose a donation option
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              For individuals not using the Oxford site for payments, kindly contact the GroupMappers team directly for donation support and payment instructions.
            </p>
            <a
              href="https://www.development.ox.ac.uk/groupmappers"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-gm-green px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Donate Link
            </a>
          </div>
        </div>

        <img
          src={images.fundraising || images.volunteer2 || images.hero}
          alt="GroupMappers fundraising support"
          className="h-[520px] w-full rounded-[2rem] object-cover shadow-soft"
        />
      </section>

      <section className="bg-white py-20">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-slate-200 p-7">
            <Mail className="text-gm-sky" />
            <h3 className="mt-4 text-xl font-black text-gm-navy">Email</h3>
            <p className="mt-2 text-sm text-slate-600">groupmappers@gmail.com</p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-200 p-7">
            <Phone className="text-gm-sky" />
            <h3 className="mt-4 text-xl font-black text-gm-navy">Call Us</h3>
            <p className="mt-2 text-sm text-slate-600">+8801793593083</p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-200 p-7">
            <MapPin className="text-gm-sky" />
            <h3 className="mt-4 text-xl font-black text-gm-navy">Office</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">House: 6/20 (1st floor), Block-E, Lalmatia, Mohammadpur, Dhaka, Bangladesh.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
