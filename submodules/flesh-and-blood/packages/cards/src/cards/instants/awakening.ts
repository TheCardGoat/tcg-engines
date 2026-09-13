import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/awakening.generated.ts";

export const awakening = definePitchFamily(fabPitchFamilies["awakening"], {
  keywords: [fusion("Earth")],
  abilities: () => ({
    ifHaveLessThanOpposingHeroCreateSeismicSurge: {
      kind: "resolution",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "opponent",
        op: "lt",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "seismic-surge",
            controller: "controller",
            count: {
              type: "count",
              what: "life-difference-vs-opponent",
            },
          },
          {
            type: "self-replacement",
            condition: {
              type: "has-status",
              status: "fused",
            },
            modification: {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
              count: {
                type: "double",
                operands: [
                  {
                    type: "count",
                    what: "life-difference-vs-opponent",
                  },
                ],
              },
            },
          },
        ],
      },
    },
    searchDeckGuardianAttackActionCostLessThanEqual: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              name: "Guardian Attack Action Card With Cost Less Than Or Equal To The Number Of Seismic Surge Tokens You Control",
            },
            mayFail: true,
            to: {
              zone: "hand",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { blue: awakeningBlue } = awakening.cards;
