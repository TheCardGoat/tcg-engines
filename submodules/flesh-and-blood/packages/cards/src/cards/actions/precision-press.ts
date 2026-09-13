import { goAgain, piercing } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/precision-press.generated.ts";

export const precisionPress = definePitchFamily(fabPitchFamilies["precision-press"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    sequenceGrantPropertyThisTurnGrantPropertyThisTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                or: [
                  {
                    typeBox: {
                      subtypes: ["Sword"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                  },
                ],
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: piercing(value1),
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                or: [
                  {
                    typeBox: {
                      subtypes: ["Sword"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: precisionPressRed,
  yellow: precisionPressYellow,
  blue: precisionPressBlue,
} = precisionPress.cards;
