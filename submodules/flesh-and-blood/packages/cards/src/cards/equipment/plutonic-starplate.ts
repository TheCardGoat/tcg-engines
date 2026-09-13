import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/plutonic-starplate.generated.ts";

/**
 * OMN141 Plutonic Starplate — Lightning Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   The first time you play a Lightning card during each of your opponent's
 *   turns, gain {r}.
 *   Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - Play filter uses types:["Lightning"] (checks types/supertypes/subtypes);
 *   prior supertypes-only fails when Lightning is only on the type line.
 * - actor:controller — "you play"; bare play would fire on opponent Lightning.
 * - turn-player opponent + limit 1/turn = first time each opponent turn.
 * - Single AB1 (was duplicate keyword residue).
 */
export const plutonicStarplate = defineCard(
  fabCardIdentitiesByCanonicalId["jJdBmPDP6DkFFwwDG6wNg"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      firstTimePlayLightningDuringEachOpponentSTurns: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Lightning"],
                },
              },
              bindAs: "it",
            },
          },
          state: {
            type: "turn-player",
            who: "opponent",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "gain-resources",
            amount: 1,
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
