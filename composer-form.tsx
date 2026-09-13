"use client";

import { useState } from "react";
import { createPitch, createHalfBaked } from "@/lib/actions";

type Group = { slug: string; name: string };

export function ComposerForm({
  initialTab,
  error,
  groups,
}: {
  initialTab: "pitch" | "half";
  error: string | null;
  groups: Group[];
}) {
  const [tab, setTab] = useState<"pitch" | "half">(initialTab);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-1 rounded-xl border border-line bg-card p-1.5">
        <button
          onClick={() => setTab("pitch")}
          className={`flex h-9 grow items-center justify-center rounded-lg text-sm font-semibold ${
            tab === "pitch" ? "bg-act text-white" : "text-ink-2"
          }`}
        >
          Pitch
        </button>
        <button
          onClick={() => setTab("half")}
          className={`flex h-9 grow items-center justify-center rounded-lg text-sm font-semibold ${
            tab === "half" ? "bg-ink text-white" : "text-ink-2"
          }`}
        >
          Half-baked
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-kill-bg px-3 py-2 text-sm text-kill">{error}</p>}

      {tab === "pitch" ? (
        <form action={createPitch} className="mt-5 flex flex-col gap-4">
          <Field label="Title" hint="Five words or fifty — just say what it is.">
            <input
              name="title"
              required
              minLength={5}
              maxLength={140}
              placeholder="e.g. A sandbox where founders trade honest verdicts"
              className="w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          <Field label="The idea" hint="What is it, who's it for, why now.">
            <textarea
              name="problem"
              required
              rows={4}
              placeholder="Walk through it like you're explaining it to a smart friend."
              className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          <Field label="What you're unsure about" hint="Required — this is what people actually answer.">
            <textarea
              name="biggest_doubt"
              required
              rows={3}
              placeholder="The thing that would make or break this, in your own head."
              className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          <Field label="What you've already done" hint="Optional.">
            <textarea
              name="who_pays"
              rows={2}
              placeholder="A landing page, a few user interviews, a prototype — whatever exists so far."
              className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          {groups.length > 0 && (
            <Field label="Group" hint="Optional — helps the right people find it.">
              <select
                name="group_slug"
                defaultValue=""
                className="w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
              >
                <option value="">No group</option>
                {groups.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Post as" hint="">
            <select
              name="visibility"
              defaultValue="public"
              className="w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            >
              <option value="public">Yourself</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </Field>

          <button
            type="submit"
            className="mt-1 flex h-11 items-center justify-center rounded-full bg-act text-sm font-semibold text-white"
          >
            Post pitch
          </button>
        </form>
      ) : (
        <form action={createHalfBaked} className="mt-5 flex flex-col gap-4">
          <Field label="What are you thinking about" hint="Required — even a half-formed sentence is fine.">
            <textarea
              name="thought"
              required
              rows={4}
              placeholder="Out loud, unpolished — this is a thinking space, not a pitch."
              className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          <Field label="What you're still figuring out" hint="Optional.">
            <textarea
              name="context"
              rows={3}
              placeholder="Whatever's still fuzzy — no pressure to have it worked out."
              className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-act"
            />
          </Field>

          <p className="text-xs text-ink-2">
            Half-baked posts get comments, not verdicts. Promote it to a pitch later if it goes somewhere.
          </p>

          <button
            type="submit"
            className="mt-1 flex h-11 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
          >
            Post half-baked
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-2">{hint}</span>}
    </label>
  );
}
