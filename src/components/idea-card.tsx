"use client";

import { useState, useTransition } from "react";
import * as Icon from "@/components/icons";
import { addComment, castVote, promoteToPitch, setOutcome } from "@/lib/actions";
import type { Comment, FeedIdea, Outcome, VoteKind } from "@/lib/pitches";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

const VERDICTS: {
  kind: VoteKind;
  label: string;
  icon: typeof Icon.Invest;
  text: string;
  bg: string;
  border: string;
  hover: string;
}[] = [
  {
    kind: "invest",
    label: "Invest",
    icon: Icon.Invest,
    text: "text-ok",
    bg: "bg-ok-bg",
    border: "border-ok",
    hover: "hover:border-ok hover:bg-ok-bg hover:text-ok",
  },
  {
    kind: "pivot",
    label: "Pivot",
    icon: Icon.Pivot,
    text: "text-pivot",
    bg: "bg-pivot-bg",
    border: "border-pivot",
    hover: "hover:border-pivot hover:bg-pivot-bg hover:text-pivot",
  },
  {
    kind: "kill",
    label: "Kill",
    icon: Icon.Kill,
    text: "text-kill",
    bg: "bg-kill-bg",
    border: "border-kill",
    hover: "hover:border-kill hover:bg-kill-bg hover:text-kill",
  },
];

const OUTCOME_LABEL: Record<Outcome, string> = { built: "Built", pivoted: "Pivoted", killed: "Killed" };

export function IdeaCard({
  idea,
  isMine,
  myVote,
  groupName,
  comments = [],
  canComment = false,
}: {
  idea: FeedIdea;
  isMine: boolean;
  myVote?: { kind: VoteKind; note: string };
  groupName?: string;
  comments?: Comment[];
  canComment?: boolean;
}) {
  const [voting, setVoting] = useState(false);
  const [pending, startTransition] = useTransition();
  const [picked, setPicked] = useState<VoteKind | null>(myVote?.kind ?? null);
  const [note, setNote] = useState(myVote?.note ?? "");
  const [voteError, setVoteError] = useState<string | null>(null);
  const [justVoted, setJustVoted] = useState(false);

  function submitVote() {
    if (!picked) return;
    if (!note.trim()) {
      setVoteError("Every verdict needs a sentence.");
      return;
    }
    setVoteError(null);
    startTransition(async () => {
      const res = await castVote(idea.id, picked, note);
      if (res?.error) setVoteError(res.error);
      else {
        setJustVoted(true);
        setVoting(false);
      }
    });
  }

  const total = idea.invest_count + idea.pivot_count + idea.kill_count;
  const isHalfBaked = idea.kind === "half_baked";

  return (
    <article className="rounded-xl border border-line bg-card p-4 lg:p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-act-soft text-sm font-bold text-act">
          {idea.author_name.charAt(0).toUpperCase()}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{idea.author_name}</span>
          <span className="text-xs text-ink-2">
            {timeAgo(idea.created_at)}
            {groupName && <> · {groupName}</>}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {isHalfBaked && (
            <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-2">
              Half-baked
            </span>
          )}
          {idea.outcome && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                idea.outcome === "built" ? "bg-ok-bg text-ok" : idea.outcome === "killed" ? "bg-kill-bg text-kill" : "bg-pivot-bg text-pivot"
              }`}
            >
              {OUTCOME_LABEL[idea.outcome]}
            </span>
          )}
        </div>
      </div>

      <h3 className="pitch-title mt-3.5 text-[21px] font-medium leading-[1.26] lg:text-[23px]">{idea.title}</h3>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.65] text-ink-2">{idea.problem}</p>

      {!isHalfBaked && idea.biggest_doubt && (
        <p className="mt-2 text-[13px] leading-normal text-ink-2">
          <span className="font-semibold text-ink">Unsure about — </span>
          {idea.biggest_doubt}
        </p>
      )}
      {!isHalfBaked && idea.who_pays && (
        <p className="mt-1 text-[13px] leading-normal text-ink-2">
          <span className="font-semibold text-ink">Already done — </span>
          {idea.who_pays}
        </p>
      )}
      {isHalfBaked && idea.biggest_doubt && (
        <p className="mt-2 text-[13px] leading-normal text-ink-2">{idea.biggest_doubt}</p>
      )}

      {isHalfBaked ? (
        isMine && (
          <button
            onClick={() => startTransition(() => promoteToPitch(idea.id))}
            disabled={pending}
            className="mt-3.5 flex h-8 items-center rounded-full border border-line px-3.5 text-[13px] font-semibold text-act hover:bg-act-soft disabled:opacity-50"
          >
            {pending ? "Promoting…" : "Promote to a pitch"}
          </button>
        )
      ) : (
        <div className="mt-3.5 border-t border-line pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {VERDICTS.map((v) => {
              const count = v.kind === "invest" ? idea.invest_count : v.kind === "pivot" ? idea.pivot_count : idea.kill_count;
              const active = (myVote?.kind === v.kind && !voting) || (justVoted && picked === v.kind);
              const IconC = v.icon;
              return (
                <button
                  key={v.kind}
                  onClick={() => {
                    setVoting(true);
                    setPicked(v.kind);
                    setJustVoted(false);
                  }}
                  className={`flex h-9 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold transition ${
                    active ? `${v.border} ${v.bg} ${v.text}` : `border-line text-ink-2 ${v.hover}`
                  }`}
                >
                  <IconC /> {v.label} {count > 0 && <span className="tnum opacity-60">{count}</span>}
                </button>
              );
            })}
            {total > 0 && <span className="ml-1 text-xs text-ink-2">{total} verdict{total === 1 ? "" : "s"}</span>}

            {isMine && !idea.outcome && (
              <OutcomePicker ideaId={idea.id} />
            )}
          </div>

          {myVote && !voting && (
            <p className="mt-2.5 text-[13px] leading-normal text-ink-2">
              <span className={`font-semibold ${VERDICTS.find((v) => v.kind === myVote.kind)?.text}`}>
                Your verdict:
              </span>{" "}
              {myVote.note}
              <button onClick={() => setVoting(true)} className="ml-2 font-semibold text-act">
                edit
              </button>
            </p>
          )}

          {voting && (
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-line bg-bg p-3">
              <div className="flex gap-1.5">
                {VERDICTS.map((v) => {
                  const IconC = v.icon;
                  return (
                    <button
                      key={v.kind}
                      onClick={() => setPicked(v.kind)}
                      className={`flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold ${
                        picked === v.kind ? `${v.border} ${v.bg} ${v.text}` : "border-line bg-card text-ink-2"
                      }`}
                    >
                      <IconC size={13} /> {v.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Say why, in a sentence — this is the whole point."
                className="w-full resize-none rounded-lg border border-line bg-card px-3 py-2 text-[13px] outline-none focus:border-act"
              />
              {voteError && <p className="text-xs text-kill">{voteError}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={submitVote}
                  disabled={!picked || pending}
                  className="flex h-8 items-center rounded-full bg-act px-3.5 text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  {pending ? "Saving…" : "Submit verdict"}
                </button>
                <button
                  onClick={() => {
                    setVoting(false);
                    setPicked(myVote?.kind ?? null);
                    setVoteError(null);
                  }}
                  className="text-[13px] font-semibold text-ink-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <CommentThread ideaId={idea.id} comments={comments} canComment={canComment} />
    </article>
  );
}

function CommentThread({
  ideaId,
  comments,
  canComment,
}: {
  ideaId: string;
  comments: Comment[];
  canComment: boolean;
}) {
  const [open, setOpen] = useState(comments.length > 0 && comments.length <= 3);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!body.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await addComment(ideaId, body);
      if (res?.error) setError(res.error);
      else setBody("");
    });
  }

  const count = comments.length;

  return (
    <div className="mt-3.5 border-t border-line pt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-[13px] font-semibold text-ink-2 hover:text-ink"
        >
          {count === 0 ? "Reply" : `${count} ${count === 1 ? "reply" : "replies"}`}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-act-soft text-[11px] font-bold text-act">
                {c.author_name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold">{c.author_name}</span>
                  <span className="text-[11px] text-ink-2">{timeAgo(c.created_at)}</span>
                </div>
                <p className="whitespace-pre-line text-[14px] leading-normal text-ink-2">{c.body}</p>
              </div>
            </div>
          ))}

          {canComment ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                placeholder="Add something useful — a question, an angle they missed."
                className="w-full resize-none rounded-lg border border-line bg-bg px-3 py-2 text-[13.5px] outline-none focus:border-act"
              />
              {error && <p className="text-xs text-kill">{error}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={submit}
                  disabled={!body.trim() || pending}
                  className="flex h-8 items-center rounded-full bg-act px-3.5 text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  {pending ? "Posting…" : "Reply"}
                </button>
                {count > 0 && (
                  <button onClick={() => setOpen(false)} className="text-[13px] font-semibold text-ink-2">
                    Hide
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-ink-2">Sign in to reply.</p>
          )}
        </div>
      )}
    </div>
  );
}

function OutcomePicker({ ideaId }: { ideaId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="ml-auto text-[13px] font-semibold text-ink-2 hover:text-ink">
        Mark outcome
      </button>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-1.5">
      {(["built", "pivoted", "killed"] as Outcome[]).map((o) => (
        <button
          key={o}
          disabled={pending}
          onClick={() => startTransition(() => setOutcome(ideaId, o))}
          className="h-7 rounded-full border border-line px-2.5 text-xs font-semibold text-ink-2 hover:bg-bg disabled:opacity-50"
        >
          {OUTCOME_LABEL[o]}
        </button>
      ))}
    </div>
  );
}
