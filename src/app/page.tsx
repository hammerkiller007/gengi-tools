import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("display_name, handle, background").eq("id", user.id).single()
    : { data: null };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-20">
      <p className="text-2xl font-extrabold tracking-tight text-act">gengiai</p>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Where startup people think out loud.</h1>
      <p className="mt-4 max-w-prose text-lg text-ink-2">
        Post half-formed ideas. Tear other people&apos;s apart. Build the good ones together.
      </p>
      <div className="mt-8 flex gap-3">
        <span className="rounded-full bg-ok-bg px-3 py-1 text-sm font-semibold text-ok">Invest</span>
        <span className="rounded-full bg-pivot-bg px-3 py-1 text-sm font-semibold text-pivot">Pivot</span>
        <span className="rounded-full bg-kill-bg px-3 py-1 text-sm font-semibold text-kill">Kill</span>
      </div>

      <div className="mt-12 rounded-xl border border-line bg-card p-5">
        {user ? (
          <>
            <p className="font-semibold">Signed in as {profile?.display_name ?? user.email}</p>
            <p className="text-sm text-ink-2">@{profile?.handle} · {profile?.background}</p>
            <form action={signOut} className="mt-3">
              <button className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold hover:bg-bg">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <p className="font-semibold">Not signed in</p>
            <Link href="/login" className="mt-3 inline-block rounded-full bg-act px-4 py-1.5 text-sm font-semibold text-white">Sign in</Link>
          </>
        )}
      </div>
      <p className="mt-10 text-sm text-ink-2">Staging build · Phase 1 · step 3: auth.</p>
    </main>
  );
}
