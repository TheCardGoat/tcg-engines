import type { NarutoIntent, ActionPill } from "../projection/interactions.ts";
import classes from "./cards.module.css";

type ActionBadgeKind =
  | "summon"
  | "set-support"
  | "play-support"
  | "attack"
  | "activate"
  | "leader"
  | "recovery"
  | "other";

function badgeKind(intent: NarutoIntent): ActionBadgeKind {
  switch (intent.kind) {
    case "summon":
      return "summon";
    case "set-support":
      return "set-support";
    case "activate-support-hand":
      return "play-support";
    case "declare-attack":
      return "attack";
    case "activate-support":
    case "activate-character":
      return "activate";
    case "leader-effect":
      return "leader";
    case "recovery":
      return "recovery";
    case "pass-counter":
    case "end-turn":
    case "mulligan":
    case "resolve-choice":
      return "other";
    default: {
      const exhaustive: never = intent;
      return exhaustive;
    }
  }
}

function ActionGlyph({ kind }: { readonly kind: ActionBadgeKind }) {
  switch (kind) {
    case "summon":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 11V2.5M4.5 6 8 2.5 11.5 6M3 13.5h10" />
        </svg>
      );
    case "set-support":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="2.5" width="11" height="8" rx="1.25" />
          <path d="M5 13.5h6M8 7v6M5.5 10.5 8 13l2.5-2.5" />
        </svg>
      );
    case "play-support":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m9.4 1.8-5.2 7h3.6l-1.2 5.4 5.2-7H8.2l1.2-5.4Z" />
        </svg>
      );
    case "attack":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3 13 10-10M8.5 3H13v4.5M3 3l10 10M3 8.5V3h5.5" />
        </svg>
      );
    case "activate":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1.8 9.2 6 13.5 8l-4.3 2L8 14.2 6.8 10 2.5 8l4.3-2L8 1.8Z" />
        </svg>
      );
    case "leader":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3 5 2.5 2L8 2.8 10.5 7 13 5l-1 7.5H4L3 5Z" />
        </svg>
      );
    case "recovery":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 7.5A5 5 0 1 1 11.6 4M11.5 1.8V4h-2.2M8 5.3v5.4M5.3 8h5.4" />
        </svg>
      );
    case "other":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 5v3.4M8 11h.01" />
        </svg>
      );
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function ActionBadges({ pills }: { readonly pills: readonly ActionPill[] }) {
  if (pills.length === 0) return null;
  const labels = pills.map((pill) => pill.label).join(", ");

  return (
    <span
      className={classes.actionBadgeRail}
      role="img"
      aria-label={`Available actions: ${labels}`}
      title={labels}
    >
      {pills.map((pill) => {
        const kind = badgeKind(pill.intent);
        return (
          <span
            key={pill.id}
            className={classes.actionBadge}
            data-action-kind={kind}
            title={pill.label}
            aria-hidden="true"
          >
            <ActionGlyph kind={kind} />
          </span>
        );
      })}
    </span>
  );
}
