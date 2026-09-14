import { createClient } from "@/lib/supabase/server";

export type VoteKind = "invest" | "pivot" | "kill";
export type Outcome = "built" | "pivoted" | "killed";

export type FeedIdea = {
  id: string;
  room_slug: string;
  group_slug: string | null;
  kind: "pitch" | "half_baked";
  outcome: Outcome | null;
  title: string;
  problem: string;
  who_pays: string | null;
  biggest_doubt: string | null;
  visibility: "public" | "anonymous" | "private";
  invest_count: number;
  pivot_count: number;
  kill_count: number;
  created_at: string;
  author_id: string | null;
  author_name: string;
  author_handle: string | null;
};

export type SortMode = "traction" | "seed" | "unicorns";

// ---------- reads (server-only; import from Server Components) ----------

export async function getFeed(opts: { sort?: SortMode; group?: string; room?: string } = {}) {
  const supabase = await createClient();
  const sort = opts.sort ?? "traction";

  let query = supabase.from("ideas_public").select("*");

  if (opts.group) query = query.eq("group_slug", opts.group);
  if (opts.room) query = query.eq("room_slug", opts.room);

  if (sort === "seed") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "unicorns") {
    query = query.order("invest_count", { ascending: false }).order("created_at", { ascending: false });
  } else {
    // traction: total verdict volume, newest first as tiebreak
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.limit(50);
  if (error) {
    console.error("getFeed error", error);
    return [] as FeedIdea[];
  }
  let rows = (data ?? []) as FeedIdea[];
  if (sort === "traction") {
    rows = rows.sort(
      (a, b) =>
        b.invest_count + b.pivot_count + b.kill_count - (a.invest_count + a.pivot_count + a.kill_count)
    );
  }
  return rows;
}

export async function getGroups() {
  const supabase = await createClient();
  const { data } = await supabase.from("groups").select("slug, name, sort").order("sort");
  return data ?? [];
}

export async function getGroupCounts() {
  const supabase = await createClient();
  const { data } = await supabase.from("ideas_public").select("group_slug");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.group_slug) continue;
    counts.set(row.group_slug, (counts.get(row.group_slug) ?? 0) + 1);
  }
  return counts;
}

export async function getRooms() {
  const supabase = await createClient();
  const { data } = await supabase.from("rooms").select("slug, name, description, sort").order("sort");
  return data ?? [];
}

export async function getMyStats(userId: string) {
  const supabase = await createClient();
  const [{ count: pitches }, { count: verdicts }, { data: myVotes }] = await Promise.all([
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("author_id", userId).eq("kind", "pitch"),
    supabase.from("votes").select("idea_id", { count: "exact", head: true }).eq("voter_id", userId),
    supabase.from("votes").select("kind").eq("voter_id", userId).eq("kind", "invest"),
  ]);
  return {
    pitches: pitches ?? 0,
    verdictsGiven: verdicts ?? 0,
    backedEarly: myVotes?.length ?? 0,
  };
}

export async function getMyVoteMap(userId: string | null) {
  if (!userId) return new Map<string, { kind: VoteKind; note: string }>();
  const supabase = await createClient();
  const { data } = await supabase.from("votes").select("idea_id, kind, note").eq("voter_id", userId);
  const map = new Map<string, { kind: VoteKind; note: string }>();
  for (const row of data ?? []) map.set(row.idea_id, { kind: row.kind as VoteKind, note: row.note });
  return map;
}

export type Comment = {
  id: string;
  idea_id: string;
  body: string;
  created_at: string;
  author_name: string;
};

export async function getCommentsFor(ideaIds: string[]) {
  const map = new Map<string, Comment[]>();
  if (ideaIds.length === 0) return map;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, idea_id, body, created_at, profiles(display_name)")
    .in("idea_id", ideaIds)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCommentsFor error", error);
    return map;
  }

  for (const row of data ?? []) {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const c: Comment = {
      id: row.id,
      idea_id: row.idea_id,
      body: row.body,
      created_at: row.created_at,
      author_name: (p as { display_name?: string } | null)?.display_name ?? "Member",
    };
    const list = map.get(row.idea_id) ?? [];
    list.push(c);
    map.set(row.idea_id, list);
  }
  return map;
}

export async function getMyProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, handle, bio")
    .eq("id", userId)
    .single();
  return data;
}

export async function getMyPortfolio(userId: string) {
  const supabase = await createClient();
  const [{ data: myPitches }, { data: myVerdicts }] = await Promise.all([
    supabase
      .from("ideas_public")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("votes")
      .select("idea_id, kind, note, created_at, ideas_public!inner(id, title, outcome, author_name)")
      .eq("voter_id", userId)
      .order("created_at", { ascending: false }),
  ]);
  return {
    pitches: (myPitches ?? []) as FeedIdea[],
    verdicts: myVerdicts ?? [],
  };
}
