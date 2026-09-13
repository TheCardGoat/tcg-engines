import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cull.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const cull = definePitchFamily(fabPitchFamilies["cull"], {
  keywords: [bloodDebt],
  abilities: () => ({
    mayPlayFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    ifHeroHasLostTurnMayPlayAsThought: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "heroes-lost-life-this-turn" },
        comparison: { op: "gte", value: 1 },
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    eachHeroBanishesFromTheirHand: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
          },
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "each-other-hero",
              zones: ["hand"],
              count: 1,
            },
          },
        ],
      },
    },
  }),
});
export const { red: cullRed } = cull.cards;
