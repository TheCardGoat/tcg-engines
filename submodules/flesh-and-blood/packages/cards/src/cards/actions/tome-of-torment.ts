import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-torment.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const tomeOfTorment = definePitchFamily(fabPitchFamilies["tome-of-torment"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playTomeTormentFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    draw: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { red: tomeOfTormentRed } = tomeOfTorment.cards;
