import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/potion-of-seeing.generated.ts";

export const potionOfSeeing = definePitchFamily(fabPitchFamilies["potion-of-seeing"], {
  abilities: () => ({
    instantDestroyPotionSeeingLookTargetHerosHand: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "look",
        target: {
          selector: "object",
          declared: "at-resolution",
          playerTarget: { selector: "any-hero" },
          zones: ["hand"],
          count: {
            type: "all",
          },
        },
      },
    },
  }),
});

export const { blue: potionOfSeeingBlue } = potionOfSeeing.cards;
