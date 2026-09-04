import Link from "next/link";
import { signInWithOAuth, signInWithEmail } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: { searchParams: Promise<{ mode?: string; error?: string }> }) {
  const { mode = "in", error } = await searchParams;
  const up = mode === "up";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="text-2xl font-extrabold tracking-tight text-act">gengiai</Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{up ? "Create your account" : "Sign in"}</h1>
      <p className="mt-1 text-ink-2">{up ? "Free. Anonymous posting is always available." : "Post ideas, invest, and join groups."}</p>

      {error && (
        <p className="mt-4 rounded-lg bg-kill-bg px-3 py-2 text-sm text-kill">
          {error === "auth" || error === "oauth" ? "Sign-in didn't complete. Try again." : error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2">
        <form action={signInWithOAuth.bind(null, "google")}>
          <button className="w-full rounded-full border border-line bg-card px-4 py-2.5 font-semibold hover:bg-bg">Continue with Google</button>
        </form>
        <form action={signInWithOAuth.bind(null, "linkedin_oidc")}>
          <button className="w-full rounded-full border border-line bg-card px-4 py-2.5 font-semibold hover:bg-bg">Continue with LinkedIn</button>
        </form>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-2">
        <span className="h-px flex-1 bg-line" />or with email<span className="h-px flex-1 bg-line" />
      </div>

      <form action={signInWithEmail} className="flex flex-col gap-3">
        <input type="hidden" name="mode" value={mode} />
        {up && (
          <>
            <label className="text-sm font-semibold">Your name
              <input name="name" required className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 font-normal" placeholder="How the community will see you" />
            </label>
            <label className="text-sm font-semibold">Background
              <select name="background" className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 font-normal">
                <option value="student">Student</option>
                <option value="founder">First-time founder</option>
                <option value="operator">Operator</option>
                <option value="smb_owner">Small business owner</option>
              </select>
            </label>
          </>
        )}
        <label className="text-sm font-semibold">Email
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 font-normal" placeholder="you@example.com" />
        </label>
        <label className="text-sm font-semibold">Password
          <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 font-normal" placeholder="At least 8 characters" />
        </label>
        <button className="mt-2 w-full rounded-full bg-act px-4 py-2.5 font-semibold text-white hover:opacity-90">
          {up ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-2">
        {up ? <>Already a member? <Link href="/login" className="font-semibold text-act">Sign in</Link></>
            : <>New here? <Link href="/login?mode=up" className="font-semibold text-act">Create an account</Link></>}
      </p>
    </main>
  );
}
