import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/maul.generated.ts";

export const maul = definePitchFamily(fabPitchFamilies["maul"], {
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
            amount: 3,
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
        createCrouchingTigersOnHit: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "createCrouchingTigersOnHit",
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
                        type: "create-token",
                        token: "crouching-tiger",
                        controller: "controller",
                        count: 2,
                        to: {
                          zone: "banished",
                        },
                        outputBinding: "it",
                      },
                      {
                        type: "optional",
                        effect: {
                          type: "play-card",
                          fromZones: ["banished"],
                          source: {
                            selector: "binding",
                            binding: "it",
                          },
                          duration: "this-turn",
                        },
                      },
                    ],
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                name: "Crouching Tiger",
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

export const { yellow: maulYellow } = maul.cards;
