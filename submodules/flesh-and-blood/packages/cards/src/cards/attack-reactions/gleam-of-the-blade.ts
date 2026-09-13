import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/gleam-of-the-blade.generated.ts";

export const gleamOfTheBlade = definePitchFamily(fabPitchFamilies["gleam-of-the-blade"], {
  abilities: () => ({
    weaponBoost: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
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
    discardFlurry: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "create-token",
        token: "flurry",
        controller: "controller",
      },
    },
  }),
});

export const { red: gleamOfTheBladeRed } = gleamOfTheBlade.cards;
