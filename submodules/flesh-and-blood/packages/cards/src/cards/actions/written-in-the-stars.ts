import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/written-in-the-stars.generated.ts";

export const writtenInTheStars = definePitchFamily(fabPitchFamilies["written-in-the-stars"], {
  abilities: () => ({
    createEmbodimentLightningToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "embodiment-of-lightning",
        controller: "controller",
      },
    },
    veDealtArcaneDamageTurnDraw: {
      kind: "resolution",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { blue: writtenInTheStarsBlue } = writtenInTheStars.cards;
