import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soaring-strike.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const soaringStrike = definePitchFamily(fabPitchFamilies["soaring-strike"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredStaticOnHitEffect: {
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
            outputBinding: "it",
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
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "permanent",
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
  red: soaringStrikeRed,
  yellow: soaringStrikeYellow,
  blue: soaringStrikeBlue,
} = soaringStrike.cards;
