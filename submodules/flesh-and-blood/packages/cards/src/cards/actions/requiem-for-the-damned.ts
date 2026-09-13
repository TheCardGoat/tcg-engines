import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/requiem-for-the-damned.generated.ts";

export const requiemForTheDamned = definePitchFamily(fabPitchFamilies["requiem-for-the-damned"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    lostLifeTurnPlayThoughWereInstant: {
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
    createEloquenceToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "eloquence",
        controller: "controller",
      },
    },
  }),
});

export const { red: requiemForTheDamnedRed } = requiemForTheDamned.cards;
