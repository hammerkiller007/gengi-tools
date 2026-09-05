import Link from "next/link";
import * as Icon from "@/components/icons";

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

export function TopBar({ initial }: { initial: string }) {
  const item = "flex h-[34px] items-center gap-1.5 rounded-lg px-2.5 text-sm";
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card">
      <div className="mx-auto flex h-14 max-w-[1128px] items-center gap-3 px-4 lg:gap-4 lg:px-6">
        <Link href="/" className="text-[21px] font-extrabold tracking-tight text-act lg:text-[22px]">
          gengiai
        </Link>

        <div className="hidden h-[34px] max-w-[280px] grow items-center gap-2 rounded-full border border-line bg-bg px-3.5 text-ink-2 lg:flex">
          <Icon.Search size={16} />
          <span className="text-[13px]">Search pitches, groups</span>
        </div>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          <span className={`${item} bg-bg font-semibold text-ink`}>
            <Icon.Home /> Home
          </span>
          <span className={`${item} font-medium text-ink-2`}>
            <Icon.Groups /> Groups
          </span>
          <span className={`${item} font-medium text-ink-2`}>
            <Icon.Portfolio /> Portfolio
          </span>
          <span className={`${item} font-medium text-ink-2`}>
            <Icon.Boardroom /> Boardroom
          </span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg text-ink-2">
            <Icon.Bell />
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center text-ink-2 lg:hidden">
            <Icon.Search size={20} />
          </span>
          <span className="hidden h-[34px] items-center gap-1.5 rounded-full bg-act px-3.5 text-sm font-semibold text-white lg:flex">
            <Icon.Plus /> Pitch
          </span>
          <Avatar initial={initial} />
        </div>
      </div>
    </header>
  );
}

export function SortTabs() {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-card p-1.5">
      <span className="flex h-[34px] items-center gap-1.5 rounded-lg bg-bg px-3.5 text-sm font-semibold text-ink">
        <Icon.Flame stroke="#FF6314" /> Traction
      </span>
      <span className="flex h-[34px] items-center rounded-lg px-3.5 text-sm font-medium text-ink-2">Seed</span>
      <span className="flex h-[34px] items-center rounded-lg px-3.5 text-sm font-medium text-ink-2">Unicorns</span>
      <span className="ml-auto hidden pr-2.5 text-xs text-ink-2 sm:block">Most verdicts + replies in 24h</span>
    </div>
  );
}

export function ComposerPrompt({ initial }: { initial: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3.5 lg:px-4">
      <Avatar initial={initial} size={40} />
      <span className="flex h-11 grow items-center rounded-full border border-line px-4 text-sm text-ink-2">
        Pitch an idea — or just think out loud
      </span>
    </div>
  );
}

export function MobileNav({ initial }: { initial: string }) {
  const cell = "flex grow flex-col items-center justify-center gap-0.5";
  return (
    <nav className="sticky bottom-0 z-20 flex h-[60px] items-stretch border-t border-line bg-card lg:hidden">
      <span className={`${cell} text-ink`}>
        <Icon.Home size={21} />
        <span className="text-[11px] font-semibold">Home</span>
      </span>
      <span className={`${cell} text-ink-2`}>
        <Icon.Groups size={21} />
        <span className="text-[11px] font-medium">Groups</span>
      </span>
      <span className="flex grow items-center justify-center">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-act text-white">
          <Icon.Plus size={22} />
        </span>
      </span>
      <span className={`${cell} text-ink-2`}>
        <Icon.Portfolio size={21} />
        <span className="text-[11px] font-medium">Portfolio</span>
      </span>
      <span className={`${cell} text-ink-2`}>
        <Avatar initial={initial} size={21} />
        <span className="text-[11px] font-medium">You</span>
      </span>
    </nav>
  );
}
