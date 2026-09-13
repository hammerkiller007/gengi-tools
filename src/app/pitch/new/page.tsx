import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroups } from "@/lib/pitches";
import { ComposerForm } from "@/components/composer-form";

export default async function NewPitchPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab, error } = await searchParams;
  const groups = await getGroups();

  return (
    <main className="mx-auto min-h-screen max-w-[640px] px-4 py-8 lg:py-12">
      <Link href="/" className="text-sm font-semibold text-ink-2 hover:text-ink">
        ← Back to feed
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">New post</h1>
      <p className="mt-1 text-[14px] text-ink-2">
        Making a case? Post a <span className="font-semibold text-act">Pitch</span>. Just thinking out loud? Post{" "}
        <span className="font-semibold text-ink">Half-baked</span> — two fields, no verdicts.
      </p>

      <ComposerForm initialTab={tab === "half" ? "half" : "pitch"} error={error ?? null} groups={groups} />
    </main>
  );
}
