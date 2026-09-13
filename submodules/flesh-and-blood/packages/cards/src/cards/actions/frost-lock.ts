import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/frost-lock.generated.ts";

export const frostLock = definePitchFamily(fabPitchFamilies["frost-lock"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    activatedAbilitiesCostOpposingHeroesAdditionalTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "add",
        amount: 1,
        target: {
          selector: "opponent",
        },
        duration: "this-turn",
        appliesTo: {
          next: {},
          count: { type: "all" },
          events: ["play", "activate"],
        },
      },
    },
    ifFrostLockWasFusedGains1IfHits: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "ifHitsHeroUntilEndTheirNextTurnThey",
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
                        type: "rule-modification",
                        mode: "restrict",
                        action: "pitch",
                        filter: {
                          cost: {
                            op: "eq",
                            value: 0,
                          },
                        },
                        duration: "until-end-of-next-turn",
                      },
                      {
                        type: "rule-modification",
                        mode: "restrict",
                        action: "play",
                        filter: {
                          cost: {
                            op: "eq",
                            value: 0,
                          },
                        },
                        duration: "until-end-of-next-turn",
                      },
                    ],
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { blue: frostLockBlue } = frostLock.cards;
