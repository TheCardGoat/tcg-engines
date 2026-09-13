import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/seeds-of-tomorrow.generated.ts";

export const seedsOfTomorrow = definePitchFamily(fabPitchFamilies["seeds-of-tomorrow"], {
  abilities: () => ({
    asAdditionalCostPlayPutFromArsenalBottomDeck: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "arsenal",
          position: "bottom",
          count: 1,
        },
      },
    },
    preventNext5DamageWouldBeDealtTurn: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 5,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: seedsOfTomorrowBlue } = seedsOfTomorrow.cards;
