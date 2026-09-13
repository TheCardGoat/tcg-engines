import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pound-for-pound.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const poundForPound = definePitchFamily(fabPitchFamilies["pound-for-pound"], {
  abilities: () => ({
    triggeredPlayPoundForPoundLifeComparisonGrantPropertyPermanent: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Pound For Pound",
            },
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: dominate,
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: poundForPoundRed,
  yellow: poundForPoundYellow,
  blue: poundForPoundBlue,
} = poundForPound.cards;
