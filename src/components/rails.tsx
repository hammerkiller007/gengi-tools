import Link from "next/link";
import { signOut } from "@/app/auth/actions";

const GROUPS = [
  { initial: "C", name: "Consumer & D2C" },
  { initial: "B", name: "B2B & SaaS" },
  { initial: "H", name: "Hiring & Talent" },
  { initial: "L", name: "Local & Services" },
  { initial: "F", name: "Fundraising" },
];

const VERDICTS = [
  { dot: "bg-ok", text: "text-ok", name: "Invest", meaning: "You'd put your own time or money behind it." },
  { dot: "bg-pivot", text: "text-pivot", name: "Pivot", meaning: "Right problem, wrong shape. Say what you'd change." },
  { dot: "bg-kill", text: "text-kill", name: "Kill", meaning: "Save them a year. Explain why, not just that." },
];

const card = "rounded-xl border border-line bg-card p-4";

export function LeftRail({
  name,
  handle,
  signedIn,
}: {
  name: string;
  handle: string | null;
  signedIn: boolean;
}) {
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <div className="rounded-xl border border-line bg-card px-4 pb-4 pt-5">
        <div className="flex flex-col items-center gap-0.5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-act-soft text-xl font-bold text-act">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="mt-2.5 text-base font-semibold tracking-tight">{name}</span>
          {handle && <span className="text-[13px] text-ink-2">@{handle}</span>}
        </div>

        {signedIn ? (
          <>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-3.5">
              <Stat label="Pitches" value="0" />
              <Stat label="Verdicts given" value="0" />
              <Stat label="Backed early" value="0" />
            </div>
            <form action={signOut} className="mt-3.5 border-t border-line pt-3">
              <button className="text-[13px] font-semibold text-ink-2 hover:text-ink">Sign out</button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="mt-4 flex h-10 items-center justify-center rounded-full bg-act text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        )}
      </div>

      <div className={card}>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">Groups</span>
        <div className="mt-3 flex flex-col gap-2.5">
          {GROUPS.map((g) => (
            <div key={g.name} className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bg text-xs font-bold text-ink-2">
                {g.initial}
              </span>
              <span className="text-sm font-medium">{g.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline justify-between">
      <span className="text-[13px] text-ink-2">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </span>
  );
}

export function RightRail() {
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <div className={card}>
        <span className="text-sm font-semibold">How verdicts work</span>
        <div className="mt-3 flex flex-col gap-3">
          {VERDICTS.map((v) => (
            <div key={v.name} className="flex gap-2.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${v.dot}`} />
              <span className="flex flex-col gap-0.5">
                <span className={`text-[13px] font-semibold ${v.text}`}>{v.name}</span>
                <span className="text-[13px] leading-normal text-ink-2">{v.meaning}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3.5 border-t border-line pt-3 text-xs leading-normal text-ink-2">
          Every verdict needs a sentence. Half-baked posts don&apos;t get verdicts at all.
        </p>
      </div>

      <div className={card}>
        <span className="text-sm font-semibold">Two ways to post</span>
        <div className="mt-3 flex flex-col gap-3 text-[13px] leading-normal text-ink-2">
          <p>
            <span className="font-semibold text-act">Pitch</span> — you&apos;re making a case. Say what you&apos;re
            unsure about, and people answer that question.
          </p>
          <p>
            <span className="font-semibold text-ink">Half-baked</span> — you&apos;re thinking out loud. Two fields,
            no verdicts. Promote it to a pitch later if it goes somewhere.
          </p>
        </div>
      </div>
    </aside>
  );
}
