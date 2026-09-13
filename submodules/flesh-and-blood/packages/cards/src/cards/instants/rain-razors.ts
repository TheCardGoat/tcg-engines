import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rain-razors.generated.ts";

export const rainRazors = definePitchFamily(fabPitchFamilies["rain-razors"], {
  abilities: () => ({
    arrowsHave2WhileAttackingTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: rainRazorsYellow } = rainRazors.cards;
