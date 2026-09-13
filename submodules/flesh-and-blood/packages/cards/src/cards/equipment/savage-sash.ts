import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/savage-sash.generated.ts";

export const savageSash = defineCard(fabCardIdentitiesByCanonicalId["WPkcWHhWGzFKcNWQFM7hf"], {
  keywords: [temper],
  abilities: {
    actionDestroyAttackAction6MoreCostLessPlay: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      // Printed: "Attack action cards with 6 or more {p} cost you {r} less
      // to play this turn" — multi-fire future-object cost reduction, not a
      // snapshot of cards currently in hand (star hand scan would miss later
      // draws and only touch present objects). Same appliesTo family as
      // KSU006 Heartened Cross Strap, with a turn-window quota (engine has no
      // unlimited "all this turn" count yet).
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          ...nextAttackActionLatch({
            power: {
              op: "gte",
              value: 6,
            },
          }),
          count: 32,
        },
      },
    },
  },
});
