import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/performance-bonus.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const performanceBonus = definePitchFamily(fabPitchFamilies["performance-bonus"], {
  abilities: () => ({
    triggeredHitCreateTokenGold: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
    },
    playedThisGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: performanceBonusRed,
  yellow: performanceBonusYellow,
  blue: performanceBonusBlue,
} = performanceBonus.cards;
