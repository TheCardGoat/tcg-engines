import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/healing-potion.generated.ts";

export const healingPotion = definePitchFamily(fabPitchFamilies["healing-potion"], {
  abilities: () => ({
    actionDestroyGain2LifeGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-life",
        amount: 2,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});

export const { blue: healingPotionBlue } = healingPotion.cards;
