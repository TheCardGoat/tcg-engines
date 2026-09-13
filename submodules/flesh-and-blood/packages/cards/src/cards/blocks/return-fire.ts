import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/return-fire.generated.ts";

export const returnFire = definePitchFamily(fabPitchFamilies["return-fire"], {
  abilities: () => ({
    banishArrowForNextTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "start-phase",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "none",
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "until-start-of-own-next-turn",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "sequence",
                    steps: [
                      {
                        type: "move-card",
                        target: {
                          selector: "binding",
                          binding: "it",
                        },
                        to: {
                          zone: "arsenal",
                          visibility: "face-up",
                        },
                        outputBinding: "it",
                      },
                      {
                        type: "modify-numeric",
                        property: "power",
                        op: "add",
                        amount: 3,
                        target: {
                          selector: "binding",
                          binding: "it",
                        },
                        duration: "this-turn",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { red: returnFireRed } = returnFire.cards;
