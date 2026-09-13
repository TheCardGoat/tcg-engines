import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/morlock-hill.generated.ts";

export const morlockHill = definePitchFamily(fabPitchFamilies["morlock-hill"], {
  abilities: () => ({
    nextTimeWouldBeDealtLethalDamageTurnMay: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: {
          type: "event-amount",
        },
        times: 1,
        optionalCost: {
          class: "effect",
          type: "banish",
          from: "hand-or-arsenal",
          count: 1,
          filter: {
            name: "Minerva Themis",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: morlockHillBlue } = morlockHill.cards;
