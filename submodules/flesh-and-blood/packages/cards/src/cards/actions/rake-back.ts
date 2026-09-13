import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rake-back.generated.ts";

export const rakeBack = definePitchFamily(fabPitchFamilies["rake-back"], {
  keywords: [goAgain],
  abilities: () => ({
    destroyGoldRatherThanPayResourceCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Gold",
          },
        },
        optional: true,
      },
    },
    nextSwordAttackTurnGets2PowerAttacksWagerDefendingWinnerEquipEquipmentGraveyard: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                  subtypes: ["Sword"],
                },
              },
              events: ["attack", "activate"],
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "attacksWagerDefendingWinnerEquipEquipmentGraveyard",
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
                    type: "wager",
                    prize: {
                      type: "optional",
                      effect: {
                        type: "equip",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["graveyard"],
                          filter: {
                            typeBox: {
                              types: ["Equipment"],
                            },
                          },
                          count: 1,
                        },
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
                  types: ["Weapon"],
                  subtypes: ["Sword"],
                },
              },
              events: ["attack", "activate"],
            },
          },
        ],
      },
    },
  }),
});

export const { blue: rakeBackBlue } = rakeBack.cards;
