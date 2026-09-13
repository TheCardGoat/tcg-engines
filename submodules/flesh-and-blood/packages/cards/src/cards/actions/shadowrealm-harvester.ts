import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-harvester.generated.ts";
import { bloodDebt, overpower } from "../shared/keywords.ts";

export const shadowrealmHarvester = definePitchFamily(fabPitchFamilies["shadowrealm-harvester"], {
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
    wasPlayedFromBanishedZoneGetsNumber1PowerOverpower: {
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
              keyword: overpower,
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

export const { red: shadowrealmHarvesterRed } = shadowrealmHarvester.cards;
