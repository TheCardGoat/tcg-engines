import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-assertiveness.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfAssertiveness = definePitchFamily(
  fabPitchFamilies["amulet-of-assertiveness"],
  {
    keywords: [goAgain],
    abilities: () => ({
      attackReactionDestroyAmuletAssertivenessTargetAttackGainsWhen: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "gte",
            value: 4,
          },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenHitsBanishTopDeckIfSAttackAction",
              text: "",
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
                      type: "banish",
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
                        filter: attackActionFilter(),
                      },
                      then: {
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
                    },
                  ],
                },
              },
            },
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    }),
  },
);
export const { yellow: amuletOfAssertivenessYellow } = amuletOfAssertiveness.cards;
