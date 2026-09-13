import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/big-bop.generated.ts";

export const bigBop = definePitchFamily(fabPitchFamilies["big-bop"], {
  parameters: pitchMap({ red: 5, yellow: 4, blue: 3 }),
  abilities: (amount, _context) => ({
    staticTriggeredStartPhaseStartPhaseSequence: {
      kind: "static",
      staticKind: "triggered",
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
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: amount,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        supertypes: ["Guardian"],
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
                      id: "staticTriggeredAttackAttackOptionalWager",
                      text: "",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "attack",
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
                          type: "optional",
                          effect: {
                            type: "wager",
                            stake: "vigor",
                            with: {
                              selector: "attack-target",
                            },
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
                        supertypes: ["Guardian"],
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const { red: bigBopRed, yellow: bigBopYellow, blue: bigBopBlue } = bigBop.cards;
