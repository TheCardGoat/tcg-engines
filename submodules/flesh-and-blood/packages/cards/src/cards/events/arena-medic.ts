import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/arena-medic.generated.ts";

export const arenaMedic = defineCard(fabCardIdentitiesByCanonicalId.BTJDM7m8qmwQBbqFNK6Fr, {
  abilities: {
    gainLifeBasedOnHand: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
          type: "gain-life",
          amount: 3,
          target: {
            selector: "controller",
          },
        },
        else: {
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  },
});
