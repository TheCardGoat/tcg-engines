import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-reaper.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const shadowrealmReaper = definePitchFamily(fabPitchFamilies["shadowrealm-reaper"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    wasPlayedFromBanishedZoneGetsNumber1PowerGoAgain: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["banished"] },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});

export const { yellow: shadowrealmReaperYellow } = shadowrealmReaper.cards;
