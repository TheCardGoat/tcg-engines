import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/singe.generated.ts";

export const singe = definePitchFamily(fabPitchFamilies["singe"], {
  parameters: pitchMap({ red: { allyCount: 3 }, yellow: { allyCount: 2 }, blue: { allyCount: 1 } }),
  abilities: ({ allyCount }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero"],
              count: 1,
            },
          },
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "target-controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: {
                type: "up-to",
                amount: allyCount,
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: singeRed, yellow: singeYellow, blue: singeBlue } = singe.cards;
