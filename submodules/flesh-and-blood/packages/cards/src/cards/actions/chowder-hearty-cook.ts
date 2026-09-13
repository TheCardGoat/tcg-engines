import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chowder-hearty-cook.generated.ts";

import { wateryGrave } from "../shared/keywords.ts";

export const chowderHeartyCook = definePitchFamily(fabPitchFamilies["chowder-hearty-cook"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantGain1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});
export const { yellow: chowderHeartyCookYellow } = chowderHeartyCook.cards;
