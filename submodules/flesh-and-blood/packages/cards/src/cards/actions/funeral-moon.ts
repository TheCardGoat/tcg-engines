import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/funeral-moon.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const funeralMoon = definePitchFamily(fabPitchFamilies["funeral-moon"], {
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
    ifHeroHasLostTurnMayPlayAsThough: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "heroes-lost-life-this-turn" },
        comparison: { op: "gte", value: 1 },
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal", "banished"],
        asType: "instant",
        optional: true,
      },
    },
    createRunechantToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
      },
    },
  }),
});
export const { red: funeralMoonRed } = funeralMoon.cards;
