import Link from "next/link";
import Image from "next/image";
import * as Icon from "@/components/icons";

type NavKey = "home" | "groups" | "portfolio" | "boardroom";

function Avatar({ initial, size = 34 }: { initial: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-act-soft font-bold text-act"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initial}
    </span>
  );
}

const NAV: { key: NavKey; href: string; icon: typeof Icon.Home; label: string }[] = [
  { key: "home", href: "/", icon: Icon.Home, label: "Home" },
  { key: "groups", href: "/groups", icon: Icon.Groups, label: "Groups" },
  { key: "portfolio", href: "/portfolio", icon: Icon.Portfolio, label: "Portfolio" },
  { key: "boardroom", href: "/boardroom", icon: Icon.Boardroom, label: "Boardroom" },
];

export function TopBar({ initial, active = "home" }: { initial: string; active?: NavKey }) {
  const item = "flex h-[34px] items-center gap-1.5 rounded-lg px-2.5 text-sm";
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card">
      <div className="mx-auto flex h-14 max-w-[1128px] items-center gap-3 px-4 lg:gap-4 lg:px-6">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src="/brand/mark.png" alt="" width={28} height={28} className="h-7 w-7" priority />
          <span className="pitch-title text-[23px] font-semibold tracking-tight text-act lg:text-[24px]">gengiai</span>
        </Link>

        <div className="hidden h-[34px] max-w-[280px] grow items-center gap-2 rounded-full border border-line bg-bg px-3.5 text-ink-2 lg:flex">
          <Icon.Search size={16} />
          <span className="text-[13px]">Search pitches, groups</span>
        </div>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => {
            const IconC = n.icon;
            const isActive = active === n.key;
            return (
              <Link
                key={n.key}
                href={n.href}
                className={`${item} ${isActive ? "bg-bg font-semibold text-ink" : "font-medium text-ink-2 hover:bg-bg"}`}
              >
                <IconC /> {n.label}
              </Link>
            );
          })}
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg text-ink-2">
            <Icon.Bell />
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center text-ink-2 lg:hidden">
            <Icon.Search size={20} />
          </span>
          <Link
            href="/pitch/new"
            className="hidden h-[34px] items-center gap-1.5 rounded-full bg-act px-3.5 text-sm font-semibold text-white lg:flex"
          >
            <Icon.Plus /> Pitch
          </Link>
          <Link href="/portfolio">
            <Avatar initial={initial} />
          </Link>
        </div>
      </div>
    </header>
  );
}

const SORTS = [
  { key: "traction", label: "Traction", icon: true },
  { key: "seed", label: "Seed", icon: false },
  { key: "unicorns", label: "Unicorns", icon: false },
] as const;

export function SortTabs({ active = "traction", group, room }: { active?: string; group?: string; room?: string }) {
  const qs = (sort: string) => {
    const params = new URLSearchParams();
    params.set("sort", sort);
    if (group) params.set("group", group);
    if (room) params.set("room", room);
    return `/?${params.toString()}`;
  };
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-card p-1.5">
      {SORTS.map((s) => (
        <Link
          key={s.key}
          href={qs(s.key)}
          className={`flex h-[34px] items-center gap-1.5 rounded-lg px-3.5 text-sm ${
            active === s.key ? "bg-bg font-semibold text-ink" : "font-medium text-ink-2 hover:bg-bg"
          }`}
        >
          {s.icon && <Icon.Flame stroke={active === s.key ? "#FF6314" : "currentColor"} />} {s.label}
        </Link>
      ))}
      <span className="ml-auto hidden pr-2.5 text-xs text-ink-2 sm:block">Most verdicts + replies in 24h</span>
    </div>
  );
}

export function ComposerPrompt({ initial }: { initial: string }) {
  return (
    <Link
      href="/pitch/new"
      className="flex items-center gap-3 rounded-xl border border-line bg-card p-3.5 lg:px-4 hover:border-act"
    >
      <Avatar initial={initial} size={40} />
      <span className="flex h-11 grow items-center rounded-full border border-line px-4 text-sm text-ink-2">
        Pitch an idea — or just think out loud
      </span>
    </Link>
  );
}

export function MobileNav({ initial, active = "home" }: { initial: string; active?: NavKey }) {
  const cell = "flex grow flex-col items-center justify-center gap-0.5";
  const left = NAV[0];
  const groups = NAV[1];
  const portfolio = NAV[2];
  const LeftIcon = left.icon;
  const GroupsIcon = groups.icon;
  const PortfolioIcon = portfolio.icon;
  return (
    <nav className="sticky bottom-0 z-20 flex h-[60px] items-stretch border-t border-line bg-card lg:hidden">
      <Link href={left.href} className={`${cell} ${active === "home" ? "text-ink" : "text-ink-2"}`}>
        <LeftIcon size={21} />
        <span className={`text-[11px] ${active === "home" ? "font-semibold" : "font-medium"}`}>Home</span>
      </Link>
      <Link href={groups.href} className={`${cell} ${active === "groups" ? "text-ink" : "text-ink-2"}`}>
        <GroupsIcon size={21} />
        <span className={`text-[11px] ${active === "groups" ? "font-semibold" : "font-medium"}`}>Groups</span>
      </Link>
      <Link href="/pitch/new" className="flex grow items-center justify-center">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-act text-white">
          <Icon.Plus size={22} />
        </span>
      </Link>
      <Link href={portfolio.href} className={`${cell} ${active === "portfolio" ? "text-ink" : "text-ink-2"}`}>
        <PortfolioIcon size={21} />
        <span className={`text-[11px] ${active === "portfolio" ? "font-semibold" : "font-medium"}`}>Portfolio</span>
      </Link>
      <Link href="/portfolio" className={`${cell} text-ink-2`}>
        <Avatar initial={initial} size={21} />
        <span className="text-[11px] font-medium">You</span>
      </Link>
    </nav>
  );
}
