import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nature-s-path-pilgrimage.generated.ts";

export const natureSPathPilgrimage = definePitchFamily(
  fabPitchFamilies["nature-s-path-pilgrimage"],
  {
    parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
    keywords: [goAgain],
    abilities: ({ value1 }) => ({
      sequenceModifyNumericPowerThisTurnGrantPropertyTriggeredHitZoneCountSequenceRevealConditionalBindingMatchesMoveCardThis:
        {
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
                      types: ["Weapon"],
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
                    id: "triggeredHitZoneCountSequenceRevealConditionalBindingMatchesMoveCard",
                    text: "",
                    trigger: {
                      kind: "event-and-state",
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
                      state: {
                        type: "zone-count",
                        zone: "arsenal",
                        player: "controller",
                        comparison: {
                          op: "eq",
                          value: 0,
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
                                typeBox: {
                                  types: ["Action"],
                                },
                              },
                            },
                            then: {
                              type: "move-card",
                              target: {
                                selector: "binding",
                                binding: "it",
                              },
                              to: {
                                zone: "arsenal",
                              },
                              faceDown: true,
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
                      types: ["Weapon"],
                    },
                  },
                },
              },
            ],
          },
        },
    }),
  },
);

export const {
  red: natureSPathPilgrimageRed,
  yellow: natureSPathPilgrimageYellow,
  blue: natureSPathPilgrimageBlue,
} = natureSPathPilgrimage.cards;
