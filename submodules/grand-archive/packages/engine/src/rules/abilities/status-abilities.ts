import type {
  GrandArchiveRuleModification,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";

/** Non-object status behavior remains executable even when no representation card is in a deck. */
export const GRAND_ARCHIVE_CROWDS_FAVOR_TARGET_RULE = {
  kind: "rule-modification",
  mode: "add-cost",
  action: "declare-target",
  subject: { kind: "player", player: "each-player" },
  against: {
    kind: "each",
    collection: { zones: ["field"], player: "controller" },
  },
  cost: { kind: "pay-reserve", amount: 1 },
  duration: { kind: "permanent" },
} as const satisfies GrandArchiveRuleModification;

export const GRAND_ARCHIVE_CROWDS_FAVOR_TARGETED_ABILITY = {
  id: "crowds-favor-status-a3",
  kind: "triggered",
  text: "Whenever an activation, materialization, or trigger targets an object you control, you may negate it unless its controller pays (1).",
  trigger: {
    kind: "event",
    event: { name: "stack-item-targets-declared" },
  },
  effect: {
    kind: "optional",
    player: "controller",
    allOrNothing: true,
    effect: {
      kind: "unless-paid",
      player: "event-actor",
      cost: { kind: "pay-reserve", amount: 1 },
      otherwise: { kind: "negate", subject: { kind: "event-subject" } },
    },
  },
} as const satisfies GrandArchiveTriggeredAbility;
