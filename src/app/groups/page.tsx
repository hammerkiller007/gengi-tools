import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getGroups, getGroupCounts } from "@/lib/pitches";
import { TopBar, MobileNav } from "@/components/chrome";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("display_name").eq("id", user.id).single()
    : { data: null };
  const initial = (profile?.display_name ?? user?.email ?? "G").charAt(0).toUpperCase();

  const [groups, counts] = await Promise.all([getGroups(), getGroupCounts()]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} active="groups" />

      <main className="mx-auto w-full max-w-[720px] grow px-4 py-6 lg:py-10">
        <h1 className="pitch-title text-[30px] font-medium">Groups</h1>
        <p className="mt-1 text-[14px] text-ink-2">Topical communities. Post into one, or just browse.</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {groups.map((g) => (
            <Link
              key={g.slug}
              href={`/?group=${g.slug}`}
              className="flex items-center gap-3 rounded-xl border border-line bg-card p-4 hover:border-act"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-act-soft text-sm font-bold text-act">
                {g.name.charAt(0)}
              </span>
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold">{g.name}</span>
                <span className="text-xs text-ink-2">{counts.get(g.slug) ?? 0} pitches</span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <MobileNav initial={initial} />
    </div>
  );
}
