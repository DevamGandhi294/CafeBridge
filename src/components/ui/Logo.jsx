export default function Logo({ size = 'md', dark = false }) {
  const sizes = {
    sm: { text: 'text-xl', sub: 'text-[10px]' },
    md: { text: 'text-2xl', sub: 'text-xs' },
    lg: { text: 'text-4xl', sub: 'text-sm' },
    xl: { text: 'text-5xl', sub: 'text-base' },
  };

  const s = sizes[size] || sizes.md;
  const textColor = dark ? 'text-cream-50' : 'text-coffee-900';
  const subColor = dark ? 'text-cream-300' : 'text-coffee-500';

  return (
    <div className="flex flex-col items-start leading-none">
      <span className={`font-display font-light tracking-[0.04em] ${s.text} ${textColor}`}>
        Cafe<span className="font-semibold italic">Bridge</span>
      </span>
      <span className={`font-body tracking-[0.25em] uppercase mt-0.5 ${s.sub} ${subColor}`}>
        Coffee & Co.
      </span>
    </div>
  );
}
