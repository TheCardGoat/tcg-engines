import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/nip-at-the-heels.generated.ts";

export const nipAtTheHeels = definePitchFamily(fabPitchFamilies["nip-at-the-heels"], {
  abilities: () => ({
    boostLowBasePowerAttack: {
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
            and: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                numeric: [
                  {
                    property: "power",
                    basis: "base",
                    comparison: {
                      op: "lte",
                      value: 3,
                    },
                  },
                ],
              },
            ],
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: nipAtTheHeelsBlue } = nipAtTheHeels.cards;
