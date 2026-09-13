import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/hold-the-line.generated.ts";

export const holdTheLine = definePitchFamily(fabPitchFamilies["hold-the-line"], {
  abilities: () => ({
    preventDamageAfterAttackerDraws: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "cards-drawn-this-turn",
          player: "attacking-hero",
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 3,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: holdTheLineBlue } = holdTheLine.cards;
