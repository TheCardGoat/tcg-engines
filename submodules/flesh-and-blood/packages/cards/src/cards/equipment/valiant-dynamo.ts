import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/valiant-dynamo.generated.ts";

export const valiantDynamo = defineCard(fabCardIdentitiesByCanonicalId["wB9f6wWqbBzPf8KBqWqTf"], {
  keywords: [battleworn],
  abilities: {
    atBeginningEndPhaseIfVeAttacked2More: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "weapon-attacks-this-turn" },
          comparison: { op: "gte", value: 2 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "numeric",
              value: -1,
              property: "defense",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
});
