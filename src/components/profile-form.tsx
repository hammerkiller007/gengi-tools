"use client";

import { updateProfile } from "@/lib/actions";

export function ProfileForm({
  displayName,
  handle,
  bio,
  error,
  saved,
}: {
  displayName: string;
  handle: string;
  bio: string;
  error: string | null;
  saved: boolean;
}) {
  const autoHandle = /^u_[a-z0-9]{10}$/.test(handle);

  return (
    <form action={updateProfile} className="mt-6 flex flex-col gap-5">
      {error && <p className="rounded-lg bg-kill-bg px-3.5 py-2.5 text-sm text-kill">{error}</p>}
      {saved && !error && (
        <p className="rounded-lg bg-ok-bg px-3.5 py-2.5 text-sm text-ok">Saved.</p>
      )}
      {autoHandle && !saved && (
        <p className="rounded-lg bg-act-soft px-3.5 py-2.5 text-[13.5px] leading-normal text-ink-2">
          Your handle is still the one we generated at sign-up. Pick a real one — it&apos;s what
          people see next to everything you post.
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Name</span>
        <input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          required
          minLength={2}
          maxLength={60}
          className="w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
        />
        <span className="text-xs text-ink-2">Shown on your pitches and verdicts.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Handle</span>
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 focus-within:border-act">
          <span className="text-[15px] text-ink-2">@</span>
          <input
            id="handle"
            name="handle"
            defaultValue={handle}
            required
            pattern="[a-zA-Z0-9_]{3,24}"
            maxLength={24}
            className="w-full bg-transparent py-2.5 text-[15px] outline-none"
          />
        </div>
        <span className="text-xs text-ink-2">
          3–24 characters. Lowercase letters, numbers and underscores.
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">One line about you</span>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          rows={2}
          maxLength={160}
          placeholder="What you're building, or what you know enough about to be useful on."
          className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
        />
        <span className="text-xs text-ink-2">Optional. Helps people weigh your verdicts.</span>
      </label>

      <button
        type="submit"
        className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-act text-sm font-semibold text-white sm:w-auto sm:px-7"
      >
        Save profile
      </button>
    </form>
  );
}
