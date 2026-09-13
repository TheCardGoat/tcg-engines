import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/not-so-fast.generated.ts";

export const notSoFast = definePitchFamily(fabPitchFamilies["not-so-fast"], {
  keywords: [
    {
      name: "specialization",
      hero: "Scurv",
    },
  ],
  abilities: () => ({
    nextTimeOpponentWouldDrawFromEffectGoldToken: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "draw",
          player: "opponent",
          filter: {
            name: "Gold",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        modification: {
          type: "draw",
          count: 1,
          player: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: notSoFastYellow } = notSoFast.cards;
