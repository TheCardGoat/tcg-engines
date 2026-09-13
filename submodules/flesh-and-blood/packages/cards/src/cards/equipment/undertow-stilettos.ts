import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/undertow-stilettos.generated.ts";

export const undertowStilettos = defineCard(
  fabCardIdentitiesByCanonicalId["7FKzc7kNTqjg78RNqwM77"],
  {
    keywords: [battleworn],
    abilities: {
      attackReactionDestroyCreateSlitherHand: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "create-token",
          token: "slither",
          controller: "controller",
          to: {
            zone: "hand",
          },
        },
      },
    },
  },
);
