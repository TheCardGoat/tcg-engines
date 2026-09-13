import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-resentment.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const risingResentment = definePitchFamily(fabPitchFamilies["rising-resentment"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredHitOptionalBanishCountSequenceModifyNumericCostThisTurnPlayCardThisTurn: {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                and: [
                  attackActionFilter(),
                  {
                    cost: {
                      op: "lt",
                      value: {
                        type: "count",
                        what: "chain-links",
                        player: "controller",
                        filter: {
                          typeBox: {
                            supertypes: ["Draconic"],
                          },
                        },
                      },
                    },
                  },
                ],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "cost",
                op: "subtract",
                amount: 1,
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
              {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  }),
});

export const {
  red: risingResentmentRed,
  yellow: risingResentmentYellow,
  blue: risingResentmentBlue,
} = risingResentment.cards;
