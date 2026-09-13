import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/barkbone-strapping.generated.ts";

export const barkboneStrapping = defineCard(
  fabCardIdentitiesByCanonicalId["dLhBfHW9rQGrQHqRrcQqG"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyBarkboneStrappingRoll6DieGainEqual: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "roll",
              sides: 6,
            },
            {
              type: "gain-resources",
              amount: {
                type: "roll-result",
                divisor: 2,
                rounding: "down",
              },
            },
          ],
        },
      },
    },
  },
);
