import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spark-of-genius.generated.ts";

export const sparkOfGenius = definePitchFamily(fabPitchFamilies["spark-of-genius"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dash",
    },
  ],
  abilities: () => ({
    searchDeckForMechanologistItemWithCostXPutIntoArenaShuffle: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                supertypes: ["Mechanologist"],
                subtypes: ["Item"],
              },
              cost: {
                op: "eq",
                value: { type: "x" },
              },
            },
            mayFail: true,
            to: {
              zone: "permanent",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
    haveBoostedTurnDraw: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { yellow: sparkOfGeniusYellow } = sparkOfGenius.cards;
