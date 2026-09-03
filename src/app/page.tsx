export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-20">
      <p className="text-2xl font-extrabold tracking-tight text-act">gengiai</p>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">
        Where startup people think out loud.
      </h1>
      <p className="mt-4 max-w-prose text-lg text-ink-2">
        Post half-formed ideas. Tear other people&apos;s apart. Build the good ones together.
      </p>
      <div className="mt-8 flex gap-3">
        <span className="rounded-full bg-ok-bg px-3 py-1 text-sm font-semibold text-ok">Invest</span>
        <span className="rounded-full bg-pivot-bg px-3 py-1 text-sm font-semibold text-pivot">Pivot</span>
        <span className="rounded-full bg-kill-bg px-3 py-1 text-sm font-semibold text-kill">Kill</span>
      </div>
      <p className="mt-16 text-sm text-ink-2">Staging build · Phase 1 · nothing works yet, on purpose.</p>
    </main>
  );
}
