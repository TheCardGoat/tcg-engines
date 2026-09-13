import type {
  GrandArchiveActivatedAbility,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";

const STATIC_COUNTER_REMOVED_BINDING = "game:static-counter-removed";
const WITHERED_OBJECT_BINDING = "game:withered-object";
const WITHERED_OBJECTS = {
  zones: ["field"],
  player: "controller",
  filter: { kind: "has-counter", counter: "wither" },
} as const;

/** Comprehensive Rules, Counters — Enlighten 1. Conferred by the counter itself. */
export const GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY = {
  id: "game:enlighten-counter-a1",
  kind: "activated",
  activation: "ability",
  functionalZones: ["field"],
  text: "Remove three enlighten counters from this object: Draw a card.",
  cost: {
    kind: "remove-counter",
    subject: { kind: "source" },
    counter: "enlighten",
    amount: 3,
  },
  effect: {
    kind: "draw",
    player: "controller",
    amount: 1,
  },
} as const satisfies GrandArchiveActivatedAbility;

/** Comprehensive Rules, Counters — Static 1–2. Instanced once per counter-bearing object. */
export const GRAND_ARCHIVE_STATIC_COUNTER_TRIGGERED_ABILITY = {
  id: "game:static-counter-a1",
  kind: "triggered",
  text: "Whenever an arcane element unit you control deals combat damage to an object, you may remove a static counter from this object. If you do, this object deals 1 damage to the object that was dealt combat damage.",
  trigger: {
    kind: "event",
    event: { name: "damage-dealt", combatDamage: true },
  },
  effect: {
    kind: "optional",
    player: "controller",
    allOrNothing: true,
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "attempt",
          effect: {
            kind: "remove-counter",
            subject: { kind: "source" },
            counter: "static",
            amount: 1,
          },
          bindSucceededAs: STATIC_COUNTER_REMOVED_BINDING,
        },
        {
          kind: "conditional",
          condition: {
            kind: "effect-succeeded",
            binding: STATIC_COUNTER_REMOVED_BINDING,
          },
          then: {
            kind: "deal-damage",
            source: { kind: "source" },
            recipient: { kind: "event-recipient" },
            amount: 1,
          },
        },
      ],
    },
  },
} as const satisfies GrandArchiveTriggeredAbility;

/**
 * Comprehensive Rules, Counters — Wither 1–4.
 *
 * This is deliberately one game-sourced trigger. Each object's payment is
 * independent and exact; counters remain in place until every payment or
 * sacrifice instruction has completed, then all remaining counters are
 * removed by one atomic collection allocation.
 */
export const GRAND_ARCHIVE_WITHER_TRIGGERED_ABILITY = {
  id: "game:wither-a1",
  kind: "triggered",
  text: "At the beginning of a player's main phase, if they control one or more objects with a wither counter on them, they sacrifice each of those objects unless they pay 1 reserve for each wither counter on it, then remove those counters.",
  trigger: { kind: "event", event: { name: "phase-begins", phase: "main" } },
  effect: {
    kind: "sequence",
    effects: [
      {
        kind: "for-each",
        collection: WITHERED_OBJECTS,
        bindEachAs: WITHERED_OBJECT_BINDING,
        effect: {
          kind: "unless-paid",
          player: "controller",
          cost: {
            kind: "pay-reserve",
            amount: {
              kind: "counter-count",
              subject: { kind: "bound", binding: WITHERED_OBJECT_BINDING },
              counter: "wither",
            },
          },
          otherwise: {
            kind: "sacrifice",
            subject: { kind: "bound", binding: WITHERED_OBJECT_BINDING },
          },
        },
      },
      {
        kind: "remove-counters-from-collection",
        collection: WITHERED_OBJECTS,
        counter: "wither",
        count: { kind: "all" },
        chooser: "controller",
      },
    ],
  },
} as const satisfies GrandArchiveTriggeredAbility;
