import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/wide-blue-yonder.generated.ts";

export const wideBlueYonder = definePitchFamily(fabPitchFamilies["wide-blue-yonder"], {
  abilities: () => ({
    boostForBlueCardsPitched: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-pitched-this-turn",
          filter: {
            color: ["blue"],
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: wideBlueYonderBlue } = wideBlueYonder.cards;
