import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/timesnap-potion.generated.ts";

export const timesnapPotion = definePitchFamily(fabPitchFamilies["timesnap-potion"], {
  abilities: () => ({
    actionDestroyGainNumber2ActionPoints: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "gain-action-points",
        amount: 2,
      },
    },
  }),
});

export const { blue: timesnapPotionBlue } = timesnapPotion.cards;
