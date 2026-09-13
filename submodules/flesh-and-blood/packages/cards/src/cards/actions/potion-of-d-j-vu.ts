import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/potion-of-d-j-vu.generated.ts";

export const potionOfDJVu = definePitchFamily(fabPitchFamilies["potion-of-d-j-vu"], {
  abilities: () => ({
    instantDestroyPotionDJVuPutAllPitchZoneTopDeckAnyOrder: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["pitch"],
          count: {
            type: "all",
          },
        },
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
  }),
});

export const { blue: potionOfDJVuBlue } = potionOfDJVu.cards;
