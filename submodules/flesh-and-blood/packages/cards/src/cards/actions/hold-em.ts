import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hold-em.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const holdEm = definePitchFamily(fabPitchFamilies["hold-em"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  keywords: [goAgain],
  abilities: (amount) => ({
    sequenceModifyNumericPowerThisTurnGrantPropertyTriggeredAttackOptionalWagerThisTurnWager: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Warrior"],
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
                id: "triggeredAttackOptionalWager",
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
                  supertypes: ["Warrior"],
                },
              },
            },
          },
        ],
      },
      label: {
        name: "wager",
      },
    },
  }),
});

export const { red: holdEmRed, yellow: holdEmYellow, blue: holdEmBlue } = holdEm.cards;
