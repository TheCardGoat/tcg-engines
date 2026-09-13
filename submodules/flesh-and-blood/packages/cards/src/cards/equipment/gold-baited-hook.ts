import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gold-baited-hook.generated.ts";

export const goldBaitedHook = defineCard(fabCardIdentitiesByCanonicalId["FmmqBdRdbrjzcQ7cp6jKq"], {
  keywords: [battleworn],
  abilities: {
    actionNextPirateAttackTurnGetsWhenHitsHero: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroStealGoldTokenTheyControlOtherwise",
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
                    type: "conditional",
                    condition: {
                      type: "target-exists",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "opponent",
                        zones: ["permanent"],
                        filter: {
                          name: "Gold",
                          typeBox: {
                            metatypes: ["Token"],
                          },
                        },
                        count: 1,
                      },
                    },
                    then: {
                      type: "gain-control",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "opponent",
                        zones: ["permanent"],
                        filter: {
                          name: "Gold",
                          typeBox: {
                            metatypes: ["Token"],
                          },
                        },
                        count: 1,
                      },
                      controller: "controller",
                    },
                    else: {
                      type: "create-token",
                      token: "gold",
                      controller: "controller",
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
                  supertypes: ["Pirate"],
                },
              },
            },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event-and-state",
              event: {
                name: "end-phase",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
              },
              state: {
                type: "not",
                condition: {
                  type: "performed-this-turn",
                  event: "create-or-steal-gold",
                  player: "controller",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
            },
          },
        ],
      },
    },
  },
});
