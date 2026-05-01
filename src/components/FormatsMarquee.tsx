const formatItems = [
  'Stories Instagram',
  'Reels',
  'Lives YouTube',
  'Statuts WhatsApp',
  'Posts Facebook',
  'TikTok',
  'Sites web',
  'Newsletters',
  'Threads',
  'Snapchat',
  'Twitch',
  'Pinterest',
];

const marqueeLoop = [...formatItems, ...formatItems];

export default function FormatsMarquee() {
  return (
    <section className="formats-marquee-section" aria-label="Formats monetisables">
      <div className="formats-marquee-shell">
        <div className="formats-marquee-track">
          {marqueeLoop.map((item, index) => (
            <div className="formats-marquee-item" key={`${item}-${index}`}>
              <span>{item}</span>
              <i className="formats-marquee-dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
