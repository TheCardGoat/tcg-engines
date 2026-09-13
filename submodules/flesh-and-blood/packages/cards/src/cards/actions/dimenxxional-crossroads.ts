import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dimenxxional-crossroads.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const dimenxxionalCrossroads = definePitchFamily(
  fabPitchFamilies["dimenxxional-crossroads"],
  {
    keywords: [goAgain],
    abilities: () => ({
      wheneverPlayAttackActionNonAttackActionFromBanished: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
                typeBox: {
                  types: ["Action"],
                },
                firstOfTypeThisTurn: true,
              },
            },
            from: ["banished"],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["hero"],
              count: 1,
            },
          },
        },
      },
      ifLoseDuringTurnDestroyDimenxxionalCrossroads: {
        kind: "resolution",
        condition: {
          type: "and",
          conditions: [
            { type: "performed-this-turn", event: "lose-life", player: "controller" },
            { type: "turn-player", who: "self" },
          ],
        },
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    }),
  },
);
export const { yellow: dimenxxionalCrossroadsYellow } = dimenxxionalCrossroads.cards;
