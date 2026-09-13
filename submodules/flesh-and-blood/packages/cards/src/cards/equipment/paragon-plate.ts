import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/paragon-plate.generated.ts";

export const paragonPlate = defineCard(fabCardIdentitiesByCanonicalId["CWDdwtBckLgb6gR6KqnD9"], {
  keywords: [temper],
  abilities: {
    attackReactionRemove1CounterFromAttackingSwordControl: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "remove-counters",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
            filter: {
              typeBox: {
                subtypes: ["Sword"],
              },
              hasStatus: "attacking",
            },
          },
        ],
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
