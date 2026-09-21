import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lumina-ascension.generated.ts";

export const luminaAscension = definePitchFamily(fabPitchFamilies["lumina-ascension"], {
  keywords: [
    {
      name: "specialization",
      hero: "Boltyn",
    },
    goAgain,
  ],
  abilities: () => ({
    endTurnWeaponsGain1PowerHitsRevealTopDeckLightPutHerosSoulGain1LifeOtherwisePutBottomDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "hitsRevealTopDeckLightPutHerosSoulGain1LifeOtherwisePutBottomDeck",
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
                              supertypes: ["Light"],
                            },
                          },
                        },
                        then: {
                          type: "sequence",
                          steps: [
                            {
                              type: "move-card",
                              target: {
                                selector: "binding",
                                binding: "it",
                              },
                              to: {
                                zone: "soul",
                              },
                            },
                            {
                              type: "gain-life",
                              amount: 1,
                              target: {
                                selector: "controller",
                              },
                            },
                          ],
                        },
                        else: {
                          type: "move-card",
                          target: {
                            selector: "binding",
                            binding: "it",
                          },
                          to: {
                            zone: "deck",
                            position: "bottom",
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
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
        ],
      },
    },
    chargedTurnAttackAdditionalTimeWeapon: {
      kind: "resolution",
      // CR 5.2.3c: the performed charge gates the allowance, not a player
      // decision — it applies to every weapon by itself.
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "modify-activation-limit",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon"],
          count: {
            type: "all",
          },
        },
        operation: "additional",
        count: 1,
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: luminaAscensionYellow } = luminaAscension.cards;
