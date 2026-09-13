import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/engulfing-flamewave.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
export const engulfingFlamewave = definePitchFamily(fabPitchFamilies["engulfing-flamewave"], {
  keywords: [goAgain],
  abilities: () => ({
    staticTriggeredHitSequence: {
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
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
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
              },
              then: {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: engulfingFlamewaveRed,
  yellow: engulfingFlamewaveYellow,
  blue: engulfingFlamewaveBlue,
} = engulfingFlamewave.cards;
