import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/pitches";
import { TopBar, MobileNav } from "@/components/chrome";
import { ProfileForm } from "@/components/profile-form";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getMyProfile(user.id);
  const displayName = profile?.display_name ?? "";
  const initial = (displayName || user.email || "G").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopBar initial={initial} active="portfolio" />

      <main className="mx-auto w-full max-w-[620px] grow px-4 py-6 lg:py-10">
        <h1 className="pitch-title text-[30px] font-medium">Your profile</h1>
        <p className="mt-1 text-[14px] text-ink-2">
          This is what people see when you pitch an idea or call a verdict on theirs.
        </p>

        <ProfileForm
          displayName={displayName}
          handle={profile?.handle ?? ""}
          bio={profile?.bio ?? ""}
          error={error ?? null}
          saved={saved === "1"}
        />
      </main>

      <MobileNav initial={initial} active="portfolio" />
    </div>
  );
}
