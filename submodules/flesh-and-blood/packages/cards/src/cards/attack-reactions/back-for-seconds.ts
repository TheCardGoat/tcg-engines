import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/back-for-seconds.generated.ts";

export const backForSeconds = definePitchFamily(fabPitchFamilies["back-for-seconds"], {
  abilities: () => ({
    boostSecondSwordAttack: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
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
                  subtypes: ["Sword"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "self-replacement",
            condition: {
              type: "compare-amount",
              amount: { type: "count", what: "attacks-this-turn" },
              comparison: { op: "eq", value: 2 },
            },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: backForSecondsYellow } = backForSeconds.cards;
