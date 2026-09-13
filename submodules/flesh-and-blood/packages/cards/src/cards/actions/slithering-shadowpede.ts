import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/slithering-shadowpede.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const slitheringShadowpede = definePitchFamily(fabPitchFamilies["slithering-shadowpede"], {
  keywords: [bloodDebt],
  abilities: () => ({
    wasBanishedFromHandTurnPlayFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      condition: { type: "moved-this-turn", from: "hand", to: "banished", onlySource: true },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
      },
    },
  }),
});

export const { red: slitheringShadowpedeRed } = slitheringShadowpede.cards;
