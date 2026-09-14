import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopBar, SortTabs, ComposerPrompt, MobileNav } from "@/components/chrome";
import { LeftRail, RightRail } from "@/components/rails";
import { IdeaCard } from "@/components/idea-card";
import * as Icon from "@/components/icons";
import {
  getCommentsFor,
  getFeed,
  getGroups,
  getMyStats,
  getMyVoteMap,
  type SortMode,
} from "@/lib/pitches";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; group?: string; room?: string }>;
}) {
  const { sort: sortParam, group, room } = await searchParams;
  const sort: SortMode = sortParam === "seed" || sortParam === "unicorns" ? sortParam : "traction";

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

  const [feed, groups, stats, myVotes] = await Promise.all([
    getFeed({ sort, group, room }),
    getGroups(),
    user ? getMyStats(user.id) : Promise.resolve(undefined),
    getMyVoteMap(user?.id ?? null),
  ]);

  const groupName = group ? groups.find((g) => g.slug === group)?.name : undefined;
  const commentMap = await getCommentsFor(feed.map((i) => i.id));

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} active="home" />

      <div className="mx-auto grid w-full max-w-[1128px] grow grid-cols-1 items-start gap-6 px-3 py-3 lg:grid-cols-[236px_minmax(0,1fr)_300px] lg:px-6 lg:py-6">
        <LeftRail
          name={name}
          handle={handle}
          signedIn={!!user}
          stats={stats}
          groups={groups}
          activeGroup={group}
        />

        <main className="flex flex-col gap-3 lg:gap-4">
          {(group || room) && (
            <div className="flex items-center gap-2 text-sm text-ink-2">
              <span>
                Filtered by <span className="font-semibold text-ink">{groupName ?? room}</span>
              </span>
              <Link href="/" className="font-semibold text-act">
                Clear
              </Link>
            </div>
          )}

          <SortTabs active={sort} group={group} room={room} />
          {user && <ComposerPrompt initial={initial} />}

          {feed.length === 0 ? (
            <EmptyFeed signedIn={!!user} />
          ) : (
            <div className="flex flex-col gap-3">
              {feed.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isMine={!!user && idea.author_id === user.id}
                  myVote={myVotes.get(idea.id)}
                  groupName={idea.group_slug ? groups.find((g) => g.slug === idea.group_slug)?.name : undefined}
                  comments={commentMap.get(idea.id) ?? []}
                  canComment={!!user}
                />
              ))}
            </div>
          )}
        </main>

        <RightRail />
      </div>

      <MobileNav initial={initial} active="home" />
    </div>
  );
}

function EmptyFeed({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="rounded-xl border border-line bg-card p-6 lg:p-8">
      <h1 className="pitch-title text-[26px] font-medium lg:text-[30px]">No pitches yet.</h1>
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
          <Link
            href="/pitch/new"
            className="flex h-11 items-center gap-2 rounded-full bg-act px-5 text-sm font-semibold text-white"
          >
            <Icon.Plus /> Post the first one
          </Link>
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
