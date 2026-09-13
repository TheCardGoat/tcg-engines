import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/twist-and-turn.generated.ts";

export const twistAndTurn = definePitchFamily(fabPitchFamilies["twist-and-turn"], {
  parameters: pitchMap({ red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: value1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "triggeredStaticOnHitEffect",
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
                    type: "optional",
                    effect: {
                      type: "modify-activation-limit",
                      target: {
                        selector: "self",
                      },
                      operation: "additional",
                      count: 1,
                      duration: "this-turn",
                    },
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
                  subtypes: ["Dagger"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: twistAndTurnRed,
  yellow: twistAndTurnYellow,
  blue: twistAndTurnBlue,
} = twistAndTurn.cards;
