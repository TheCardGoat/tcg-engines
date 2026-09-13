import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hungering-demigon.generated.ts";

export const hungeringDemigon = definePitchFamily(fabPitchFamilies["hungering-demigon"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playZoneCount: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "zone-count",
        zone: "soul",
        player: "opponent",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
      },
    },
    triggeredHitBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["soul"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: hungeringDemigonRed,
  yellow: hungeringDemigonYellow,
  blue: hungeringDemigonBlue,
} = hungeringDemigon.cards;
