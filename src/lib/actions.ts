"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { VoteKind, Outcome } from "@/lib/pitches";

export async function createPitch(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const problem = String(formData.get("problem") ?? "").trim();
  const biggest_doubt = String(formData.get("biggest_doubt") ?? "").trim();
  const who_pays = String(formData.get("who_pays") ?? "").trim();
  const group_slug = String(formData.get("group_slug") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "public").trim();

  if (title.length < 5 || !problem || !biggest_doubt) {
    redirect(
      `/pitch/new?error=${encodeURIComponent(
        "Title, the idea, and what you're unsure about are all required."
      )}`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("ideas").insert({
    author_id: user.id,
    kind: "pitch",
    room_slug: "pitch",
    group_slug: group_slug || null,
    title,
    problem,
    biggest_doubt,
    who_pays: who_pays || null,
    visibility: visibility === "anonymous" ? "anonymous" : "public",
  });

  if (error) {
    console.error("createPitch error", error);
    redirect(`/pitch/new?error=${encodeURIComponent("Something went wrong posting your pitch. Try again.")}`);
  }

  revalidatePath("/");
  redirect("/");
}

export async function createHalfBaked(formData: FormData) {
  const thought = String(formData.get("thought") ?? "").trim();
  const context = String(formData.get("context") ?? "").trim();

  if (!thought) {
    redirect(`/pitch/new?tab=half&error=${encodeURIComponent("Say what you're thinking about first.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = thought.length >= 5 ? thought.slice(0, 140) : thought.padEnd(5, ".");

  const { error } = await supabase.from("ideas").insert({
    author_id: user.id,
    kind: "half_baked",
    room_slug: "pitch",
    title,
    problem: thought,
    biggest_doubt: context || null,
    visibility: "public",
  });

  if (error) {
    console.error("createHalfBaked error", error);
    redirect(`/pitch/new?tab=half&error=${encodeURIComponent("Something went wrong posting that. Try again.")}`);
  }

  revalidatePath("/");
  redirect("/");
}

export async function promoteToPitch(ideaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("ideas").update({ kind: "pitch" }).eq("id", ideaId).eq("author_id", user.id);
  revalidatePath("/");
}

export async function castVote(ideaId: string, kind: VoteKind, note: string) {
  const trimmed = note.trim();
  if (!trimmed) return { error: "Every verdict needs a sentence." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to cast a verdict." };

  const { error } = await supabase
    .from("votes")
    .upsert(
      { idea_id: ideaId, voter_id: user.id, kind, note: trimmed },
      { onConflict: "idea_id,voter_id" }
    );

  if (error) {
    console.error("castVote error", error);
    return { error: "Something went wrong saving your verdict." };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  return { error: null };
}

export async function setOutcome(ideaId: string, outcome: Outcome) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("ideas").update({ outcome }).eq("id", ideaId).eq("author_id", user.id);
  revalidatePath("/");
  revalidatePath("/portfolio");
}
