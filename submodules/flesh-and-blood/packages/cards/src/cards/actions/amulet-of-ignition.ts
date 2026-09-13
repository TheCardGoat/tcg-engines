import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-ignition.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfIgnition = definePitchFamily(fabPitchFamilies["amulet-of-ignition"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletIgnitionNextAbilityActivateTurnCosts: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "not",
        condition: {
          type: "performed-this-turn",
          event: "play-or-activate",
          player: "controller",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            hasStatus: "activated-ability",
          },
        },
      },
    },
  }),
});
export const { yellow: amuletOfIgnitionYellow } = amuletOfIgnition.cards;
