import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <main className="bg-slate-50 py-20 lg:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            Connect with GroupMappers.
          </h1>
          <div className="mt-8 space-y-4 text-slate-700">
            <p className="flex gap-3"><Phone className="text-gm-sky" /> Call Us: +8801793593083</p>
            <p className="flex gap-3"><Mail className="text-gm-sky" /> groupmappers@gmail.com</p>
            <p className="flex gap-3"><MapPin className="text-gm-sky" /> House : 6/20 (1st floor), Block- E, Lalmatia, Mohammadpur, Dhaka, Bangladesh.</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <iframe
              title="GroupMappers Bangladesh Office"
              src="https://maps.google.com/maps?q=House%206%2F20%20Block%20E%20Lalmatia%20Mohammadpur%20Dhaka%20Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          {['Name', 'Email', 'Phone'].map((field) => (
            <label key={field} className="mb-5 block text-sm font-black text-gm-navy">
              {field}
              <input className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3 font-medium outline-none transition focus:border-gm-sky" type={field === 'Email' ? 'email' : 'text'} />
            </label>
          ))}
          <label className="block text-sm font-black text-gm-navy">
            Message
            <textarea rows="6" className="mt-2 block w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-medium outline-none transition focus:border-gm-sky" />
          </label>
          <button type="submit" className="mt-6 rounded-full bg-gm-navy px-7 py-4 text-sm font-black text-white transition hover:bg-gm-blue">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
