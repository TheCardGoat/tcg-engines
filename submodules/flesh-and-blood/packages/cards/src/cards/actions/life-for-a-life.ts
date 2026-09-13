import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/life-for-a-life.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const lifeForALife = definePitchFamily(fabPitchFamilies["life-for-a-life"], {
  abilities: () => ({
    triggeredPlayLifeComparisonGrantPropertyThisTurn: {
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
            kind: "source",
            selector: "played-card",
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
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    triggeredHitGainLife: {
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
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const {
  red: lifeForALifeRed,
  yellow: lifeForALifeYellow,
  blue: lifeForALifeBlue,
} = lifeForALife.cards;
