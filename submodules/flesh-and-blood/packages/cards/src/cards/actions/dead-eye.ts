import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dead-eye.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const deadEye = definePitchFamily(fabPitchFamilies["dead-eye"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    ifHasAimCounterGainsWhenHitsHeroLook: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroLookAtTheirHandChooseThey",
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
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "look",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "discard",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
            hasCounter: "aim",
          },
        },
      },
    },
  }),
});
export const { yellow: deadEyeYellow } = deadEye.cards;
