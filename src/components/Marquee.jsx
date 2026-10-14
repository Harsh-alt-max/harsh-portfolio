/** Infinite availability ticker. */
export default function Marquee() {
  const items = Array.from({ length: 8 });
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {items.map((_, i) => (
          <span key={i} className="flex items-center gap-8" aria-hidden={i > 0}>
            <span className="font-grotesk text-sm font-bold uppercase tracking-[0.3em] text-paper">
              Available for freelance & fulltime
            </span>
            <span className="text-xl text-lime">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
