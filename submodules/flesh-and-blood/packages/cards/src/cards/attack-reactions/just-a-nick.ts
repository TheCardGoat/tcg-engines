import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/just-a-nick.generated.ts";

export const justANick = definePitchFamily(fabPitchFamilies["just-a-nick"], {
  abilities: () => ({
    chooseAttackModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "up-to",
          amount: 2,
        },
      },
      modes: {
        boostLowBasePowerAttack: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 5,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                  {},
                  {
                    numeric: [
                      {
                        property: "power",
                        basis: "base",
                        comparison: {
                          op: "lte",
                          value: 1,
                        },
                      },
                    ],
                  },
                ],
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        grantBanishTopCardOnHit: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "banishTopCardOnHit",
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
                    type: "banish",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["deck"],
                      position: "top",
                      count: 1,
                    },
                    outputBinding: "banished",
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
                hasKeyword: "stealth",
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
      },
    }),
  }),
});

export const { red: justANickRed } = justANick.cards;
