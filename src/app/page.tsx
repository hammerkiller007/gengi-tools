import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopBar, SortTabs, ComposerPrompt, MobileNav } from "@/components/chrome";
import { LeftRail, RightRail } from "@/components/rails";
import * as Icon from "@/components/icons";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("display_name, handle").eq("id", user.id).single()
    : { data: null };

  const name = profile?.display_name ?? user?.email?.split("@")[0] ?? "Guest";
  const handle = profile?.handle ?? null;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} />

      <div className="mx-auto grid w-full max-w-[1128px] grow grid-cols-1 items-start gap-6 px-3 py-3 lg:grid-cols-[236px_minmax(0,1fr)_300px] lg:px-6 lg:py-6">
        <LeftRail name={name} handle={handle} signedIn={!!user} />

        <main className="flex flex-col gap-3 lg:gap-4">
          <SortTabs />
          <ComposerPrompt initial={initial} />
          <EmptyFeed signedIn={!!user} />
        </main>

        <RightRail />
      </div>

      <MobileNav initial={initial} />
    </div>
  );
}

function EmptyFeed({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="rounded-xl border border-line bg-card p-6 lg:p-8">
      <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">No pitches yet.</h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-2">
        Gengiai is where startup and business ideas get an honest read — you post what you&apos;re working on,
        and people tell you whether they&apos;d back it, reshape it, or spare you the year. Yours would be the
        first.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="flex h-9 items-center gap-2 rounded-full border border-ok bg-ok-bg px-3.5 text-[13px] font-semibold text-ok">
          <Icon.Invest /> Invest
        </span>
        <span className="flex h-9 items-center gap-2 rounded-full border border-pivot bg-pivot-bg px-3.5 text-[13px] font-semibold text-pivot">
          <Icon.Pivot /> Pivot
        </span>
        <span className="flex h-9 items-center gap-2 rounded-full border border-kill bg-kill-bg px-3.5 text-[13px] font-semibold text-kill">
          <Icon.Kill /> Kill
        </span>
      </div>

      <p className="mt-4 text-[13px] leading-normal text-ink-2">
        Every verdict comes with a sentence. That&apos;s the whole point — a number tells you nothing, a reason
        tells you what to do next.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {signedIn ? (
          <p className="text-[13px] leading-normal text-ink-2">
            You&apos;re signed in and on the list. The pitch composer is what ships next — nothing for you to do
            here yet.
          </p>
        ) : (
          <>
            <Link
              href="/login?mode=up"
              className="flex h-11 items-center gap-2 rounded-full bg-act px-5 text-sm font-semibold text-white"
            >
              <Icon.Plus /> Create an account
            </Link>
            <Link href="/login" className="text-sm font-semibold text-act">
              or sign in
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
