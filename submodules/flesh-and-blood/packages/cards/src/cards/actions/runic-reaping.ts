import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-reaping.generated.ts";

export const runicReaping = definePitchFamily(fabPitchFamilies["runic-reaping"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  abilities: (count) => ({
    grantPropertyTriggeredHitCreateTokenRunechantThisTurn: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredHitCreateTokenRunechant",
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
                type: "create-token",
                token: "runechant",
                controller: "controller",
                count,
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
              supertypes: ["Runeblade"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    hasStatusPitchedAttackCardToPlayThisModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "pitched-attack-action-card-to-play-this",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Runeblade"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const {
  red: runicReapingRed,
  yellow: runicReapingYellow,
  blue: runicReapingBlue,
} = runicReaping.cards;
