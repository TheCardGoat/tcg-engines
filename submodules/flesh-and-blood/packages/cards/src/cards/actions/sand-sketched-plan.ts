import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sand-sketched-plan.generated.ts";

export const sandSketchedPlan = definePitchFamily(fabPitchFamilies["sand-sketched-plan"], {
  keywords: [
    {
      name: "specialization",
      hero: "Rhinar",
    },
  ],
  abilities: () => ({
    searchDeckForPutIntoHandDiscardRandomShuffleDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          // Search the deck for a card and put it into hand. The engine's
          // search effect emits BOTH the `search` event AND a per-object
          // `move-zone` (put) event when `to` is a non-deck zone
          // (card-movement-effects.ts), so the historical standalone
          // `move-card` step was redundant and is removed. Searching the deck
          // also auto-emits a `shuffle-zone`; the explicit `shuffle` step
          // below preserves the printed "then shuffle your deck" tail.
          {
            type: "search",
            zones: ["deck"],
            filter: {},
            mayFail: true,
            to: {
              zone: "hand",
            },
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              random: true,
            },
            outputBinding: "it",
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
    discardedHasNumber6MorePowerGainNumber2ActionPoints: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "it",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      effect: {
        type: "gain-action-points",
        amount: 2,
      },
    },
  }),
});

export const { blue: sandSketchedPlanBlue } = sandSketchedPlan.cards;
