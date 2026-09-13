import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swabbie.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const swabbie = definePitchFamily(fabPitchFamilies["swabbie"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceResourceTAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const { yellow: swabbieYellow } = swabbie.cards;
