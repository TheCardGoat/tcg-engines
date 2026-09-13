import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/orihon-of-mystic-tenets.generated.ts";

export const orihonOfMysticTenets = definePitchFamily(fabPitchFamilies["orihon-of-mystic-tenets"], {
  keywords: [legendary],
  abilities: () => ({
    draw2IfChiWasPitchedPlayInsteadDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 2,
            player: "controller",
          },
          {
            type: "self-replacement",
            condition: {
              type: "binding-numeric",
              binding: "pitched-this-way-chi-card",
              comparison: { op: "eq", value: 1 },
            },
            modification: {
              type: "draw",
              count: 3,
              player: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: orihonOfMysticTenetsBlue } = orihonOfMysticTenets.cards;
