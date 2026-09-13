import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/kindle.generated.ts";

export const kindle = definePitchFamily(fabPitchFamilies["kindle"], {
  keywords: [
    {
      name: "amp",
      value: 1,
    },
  ],
  abilities: () => ({
    amp1: {
      kind: "resolution",
      effect: {
        type: "amp",
        amount: 1,
      },
    },
    ifHaveNoHandDraw: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { red: kindleRed } = kindle.cards;
