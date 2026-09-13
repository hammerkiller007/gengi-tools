import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRooms } from "@/lib/pitches";
import { TopBar, MobileNav } from "@/components/chrome";

export default async function BoardroomPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("display_name").eq("id", user.id).single()
    : { data: null };
  const initial = (profile?.display_name ?? user?.email ?? "G").charAt(0).toUpperCase();

  const rooms = await getRooms();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} active="boardroom" />

      <main className="mx-auto w-full max-w-[720px] grow px-4 py-6 lg:py-10">
        <h1 className="text-2xl font-bold tracking-tight">Boardroom</h1>
        <p className="mt-1 text-[14px] text-ink-2">Structured spaces, not just a feed. Pick a room.</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {rooms.map((r) => (
            <Link
              key={r.slug}
              href={`/?room=${r.slug}`}
              className="flex flex-col gap-1 rounded-xl border border-line bg-card p-4 hover:border-act"
            >
              <span className="text-[15px] font-semibold">{r.name}</span>
              {r.description && <span className="text-[13px] text-ink-2">{r.description}</span>}
            </Link>
          ))}
        </div>
      </main>

      <MobileNav initial={initial} active="boardroom" />
    </div>
  );
}
