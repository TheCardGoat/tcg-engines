import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/backside-of-the-blade.generated.ts";

export const backsideOfTheBlade = definePitchFamily(fabPitchFamilies["backside-of-the-blade"], {
  abilities: () => ({
    boostAndReattackWeapon: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
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
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "has-keyword",
              keyword: "go-again",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            then: {
              // CR 5.2.3c: the go-again condition gates the allowance, not a
              // player decision — it applies by itself.
              type: "modify-activation-limit",
              target: {
                selector: "binding",
                binding: "it",
              },
              operation: "additional",
              count: 1,
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: backsideOfTheBladeBlue } = backsideOfTheBlade.cards;
