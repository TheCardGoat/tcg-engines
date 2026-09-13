import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hit-the-gas.generated.ts";

export const hitTheGas = definePitchFamily(fabPitchFamilies["hit-the-gas"], {
  keywords: [
    {
      name: "specialization",
      hero: "Maxx",
    },
  ],
  abilities: () => ({
    turnAnyNumberHyperDriversBanishedZoneFaceDownGainManyActionPoints3MoreTurnedFaceDownWayDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "turn-face-down",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["banished"],
                  filter: {
                    name: "Hyper Driver",
                  },
                  count: {
                    type: "any-number",
                  },
                },
              },
              {
                type: "gain-action-points",
                amount: {
                  type: "count",
                  what: "turned-face-down-this-way",
                },
              },
            ],
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "turned-face-down-this-way",
              },
              comparison: { op: "gte", value: 3 },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: hitTheGasBlue } = hitTheGas.cards;
