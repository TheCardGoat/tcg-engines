import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/beckon-steel.generated.ts";

export const beckonSteel = definePitchFamily(fabPitchFamilies["beckon-steel"], {
  abilities: () => ({
    grantSharpenOnHit: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "sharpenSwordAndAttackOnHit",
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
                    type: "sharpen",
                    target: {
                      selector: "self",
                    },
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "has-counter",
                      counter: {
                        kind: "numeric",
                        value: 1,
                        property: "power",
                      },
                      target: {
                        selector: "self",
                      },
                      comparison: {
                        op: "gte",
                        value: 3,
                      },
                    },
                    then: {
                      type: "attack-with",
                      target: {
                        selector: "self",
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
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: beckonSteelBlue } = beckonSteel.cards;
