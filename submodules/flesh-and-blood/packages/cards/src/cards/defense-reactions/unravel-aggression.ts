import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/unravel-aggression.generated.ts";

export const unravelAggression = definePitchFamily(fabPitchFamilies["unravel-aggression"], {
  abilities: () => ({
    drawAfterPitchingChi: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-chi-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { blue: unravelAggressionBlue } = unravelAggression.cards;
