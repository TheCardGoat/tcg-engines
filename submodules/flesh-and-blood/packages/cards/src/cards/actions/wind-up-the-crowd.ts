import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wind-up-the-crowd.generated.ts";

export const windUpTheCrowd = definePitchFamily(fabPitchFamilies["wind-up-the-crowd"], {
  abilities: () => ({
    instantDiscardCreateToughnessVigorToken: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "toughness",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "vigor",
            controller: "controller",
          },
        ],
      },
    },
  }),
});

export const { blue: windUpTheCrowdBlue } = windUpTheCrowd.cards;
