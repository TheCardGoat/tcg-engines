import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/blade-flurry.generated.ts";

export const bladeFlurry = definePitchFamily(fabPitchFamilies["blade-flurry"], {
  abilities: () => ({
    targetWeaponBoost: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    nextWeaponBoost: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
  }),
});

export const { red: bladeFlurryRed } = bladeFlurry.cards;
