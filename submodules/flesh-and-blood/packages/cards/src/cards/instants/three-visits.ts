import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/three-visits.generated.ts";

export const threeVisits = definePitchFamily(fabPitchFamilies["three-visits"], {
  keywords: [
    {
      name: "ward",
      value: {
        type: "x",
      },
    },
  ],
  abilities: () => ({
    wardXWhereXIsThreeTimesNumberBlue: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "ward",
            value: {
              type: "sum",
              operands: [
                {
                  type: "count",
                  what: "cards-pitched-this-turn",
                  filter: {
                    color: ["blue"],
                  },
                },
                {
                  type: "count",
                  what: "cards-pitched-this-turn",
                  filter: {
                    color: ["blue"],
                  },
                },
                {
                  type: "count",
                  what: "cards-pitched-this-turn",
                  filter: {
                    color: ["blue"],
                  },
                },
              ],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { red: threeVisitsRed } = threeVisits.cards;
