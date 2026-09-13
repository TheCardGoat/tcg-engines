import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/expendable-limbs.generated.ts";

export const expendableLimbs = definePitchFamily(fabPitchFamilies["expendable-limbs"], {
  abilities: () => ({
    banishRandomCardAsCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          random: true,
        },
      },
    },
    playBanishedHighPowerCard: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: { power: { op: "gte", value: 6 } },
        },
        comparison: { op: "gte", value: 1 },
      },
      // Printed "you may play it from your banished zone during your next
      // action phase" is a duration grant, never optional wrapping play-card
      // (EVR053) and never a play-static permission on this DR itself.
      effect: {
        type: "play-card",
        fromZones: ["banished"],
        source: {
          selector: "binding",
          binding: "banished-this-way",
        },
        duration: "during-own-next-action-phase",
      },
    },
  }),
});

export const { blue: expendableLimbsBlue } = expendableLimbs.cards;
