import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-from-the-same-cloth.generated.ts";

export const cutFromTheSameCloth = definePitchFamily(fabPitchFamilies["cut-from-the-same-cloth"], {
  supertypeSets: [["Assassin"], ["Warrior"]],
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  keywords: [goAgain],
  abilities: (bonus) => ({
    revealMark: {
      kind: "resolution",

      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            outputBinding: "revealed",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "revealed-this-way",
                filter: { typeBox: { types: ["Attack Reaction"] } },
              },
              comparison: { op: "gte", value: 1 },
            },
            then: {
              type: "mark",
              target: {
                selector: "opponent",
              },
            },
          },
        ],
      },
      label: {
        name: "mark",
      },
    },
    modifyNumericPower: {
      kind: "resolution",

      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: bonus,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const {
  red: cutFromTheSameClothRed,
  yellow: cutFromTheSameClothYellow,
  blue: cutFromTheSameClothBlue,
} = cutFromTheSameCloth.cards;
