import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/ancestral-empowerment.generated.ts";

export const ancestralEmpowerment = definePitchFamily(fabPitchFamilies["ancestral-empowerment"], {
  abilities: () => ({
    boostNinjaAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Ninja"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    drawCard: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { red: ancestralEmpowermentRed } = ancestralEmpowerment.cards;
