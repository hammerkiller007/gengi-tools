type IconProps = { size?: number; className?: string; stroke?: string };

function base(size: number, className?: string, stroke?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: stroke ?? "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

export function Search({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function Home({ size = 17, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.75}>
      <path d="M3 10.5 12 3.5l9 7" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}

export function Groups({ size = 17, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.75}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 7" />
      <path d="M18.2 13.6c2 .9 3.3 2.9 3.3 5.2" />
    </svg>
  );
}

export function Portfolio({ size = 17, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.75}>
      <path d="M4 19.5h16" />
      <path d="M6.5 19.5V12" />
      <path d="M11.5 19.5V7.5" />
      <path d="M16.5 19.5v-5" />
    </svg>
  );
}

export function Boardroom({ size = 17, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.75}>
      <path d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5V5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function Bell({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.75}>
      <path d="M18 9.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function Plus({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2.25}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function Flame({ size = 15, className, stroke }: IconProps) {
  return (
    <svg {...base(size, className, stroke)} strokeWidth={1.75}>
      <path d="M12 3s5.2 4.4 5.2 9.1a5.2 5.2 0 0 1-10.4 0c0-1.7.7-3.1 1.6-4.1.2 1.5 1 2.4 1.9 2.4C12.3 10.4 12 6.2 12 3z" />
    </svg>
  );
}

export function Invest({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2}>
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

export function Pivot({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.9}>
      <path d="M5 19v-8a4 4 0 0 1 4-4h10" />
      <path d="m15 3 4 4-4 4" />
    </svg>
  );
}

export function Kill({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6.5 6.5 11 11" />
    </svg>
  );
}
