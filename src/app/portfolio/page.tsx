import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPortfolio, getMyStats } from "@/lib/pitches";
import { TopBar, MobileNav } from "@/components/chrome";
import { IdeaCard } from "@/components/idea-card";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, handle")
    .eq("id", user.id)
    .single();
  const initial = (profile?.display_name ?? user.email ?? "G").charAt(0).toUpperCase();

  const [{ pitches, verdicts }, stats] = await Promise.all([getMyPortfolio(user.id), getMyStats(user.id)]);

  const called = verdicts.filter((v) => {
    const idea = Array.isArray(v.ideas_public) ? v.ideas_public[0] : v.ideas_public;
    return idea?.outcome;
  });
  const rightCalls = called.filter((v) => {
    const idea = Array.isArray(v.ideas_public) ? v.ideas_public[0] : v.ideas_public;
    if (!idea?.outcome) return false;
    if (v.kind === "invest") return idea.outcome === "built";
    if (v.kind === "kill") return idea.outcome === "killed";
    return idea.outcome === "pivoted";
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} active="portfolio" />

      <main className="mx-auto w-full max-w-[720px] grow px-4 py-6 lg:py-10">
        <h1 className="pitch-title text-[30px] font-medium">Portfolio</h1>
        <p className="mt-1 text-[14px] text-ink-2">{profile?.display_name ?? user.email}</p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Stat label="Pitches" value={stats.pitches} />
          <Stat label="Verdicts given" value={stats.verdictsGiven} />
          <Stat
            label="Called right"
            value={called.length > 0 ? `${rightCalls.length}/${called.length}` : "—"}
          />
        </div>

        <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-ink-2">Your pitches</h2>
        <div className="mt-3 flex flex-col gap-3">
          {pitches.length === 0 ? (
            <p className="rounded-xl border border-line bg-card p-4 text-[14px] text-ink-2">
              Nothing posted yet — your first pitch or half-baked thought would show up here.
            </p>
          ) : (
            pitches.map((idea) => <IdeaCard key={idea.id} idea={idea} isMine />)
          )}
        </div>

        <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-ink-2">Verdicts you've given</h2>
        <div className="mt-3 flex flex-col gap-2">
          {verdicts.length === 0 ? (
            <p className="rounded-xl border border-line bg-card p-4 text-[14px] text-ink-2">
              You haven't called anything yet.
            </p>
          ) : (
            verdicts.map((v, i) => {
              const idea = Array.isArray(v.ideas_public) ? v.ideas_public[0] : v.ideas_public;
              return (
                <div key={i} className="rounded-xl border border-line bg-card p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold">{idea?.title}</span>
                    <span
                      className={`text-xs font-bold uppercase ${
                        v.kind === "invest" ? "text-ok" : v.kind === "kill" ? "text-kill" : "text-pivot"
                      }`}
                    >
                      {v.kind}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-2">{v.note}</p>
                </div>
              );
            })
          )}
        </div>
      </main>

      <MobileNav initial={initial} active="portfolio" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-card p-3.5 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-2">{label}</div>
    </div>
  );
}
