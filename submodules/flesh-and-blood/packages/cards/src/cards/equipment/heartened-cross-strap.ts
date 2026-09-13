import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heartened-cross-strap.generated.ts";

export const heartenedCrossStrap = defineCard(
  fabCardIdentitiesByCanonicalId["666mgFjKrrLQhdkpGzNzf"],
  {
    abilities: {
      actionDestroyNextAttackActionPlayTurnCostsLess: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 2,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          // Action is a type-box type; Attack is a subtype. An `and` of two
          // subtype filters never matches a real AAC (Action is not a subtype).
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  },
);
