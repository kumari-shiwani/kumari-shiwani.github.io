import { brands } from '../lib/data'

export default function BrandMarquee() {
  const row = [...brands, ...brands]

  return (
    <div className="bg-black border-y border-white/10 py-6 overflow-hidden">
      <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
        {row.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="text-white/30 text-2xl md:text-3xl tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  )
}
