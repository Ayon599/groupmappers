const galleryKeys = [
  'hero',
  'group-photo-1',
  'group-photo-2',
  'group-photo-3',
  'group-photo-4',
  'volunteer-activity-1',
  'fundraising',
  'showcase',
  'rabies'
];

export default function Gallery({ images }) {
  return (
    <main className="bg-white py-20 lg:py-28">
      <div className="section-shell">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
          Field mapping, workshops, training, and volunteer moments.
        </h1>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {galleryKeys.map((key) => (
            <img key={key} src={images[key] || images.hero} alt="GroupMappers gallery" className="h-72 w-full rounded-[1.75rem] object-cover shadow-sm" />
          ))}
        </div>
      </div>
    </main>
  );
}
