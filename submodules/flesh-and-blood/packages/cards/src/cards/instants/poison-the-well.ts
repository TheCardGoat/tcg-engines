import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/poison-the-well.generated.ts";

export const poisonTheWell = definePitchFamily(fabPitchFamilies["poison-the-well"], {
  abilities: () => ({
    nextTimeHeroWouldGainTurnInsteadTheyLose: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "gain-life",
        },
        modification: {
          type: "lose-life",
          amount: {
            type: "event-amount",
          },
          target: {
            selector: "each-hero",
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: poisonTheWellBlue } = poisonTheWell.cards;
