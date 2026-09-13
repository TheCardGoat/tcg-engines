import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/twin-twisters.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const twinTwisters = definePitchFamily(fabPitchFamilies["twin-twisters"], {
  keywords: [goAgain],
  abilities: () => ({
    chooseMode: modalAbility({
      kind: "modal",
      modal: {
        choose: 1,
      },
      modes: {
        grantPowerToNextAttackOnHit: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "empowerNextAttackOnHit",
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
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 1,
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-combat-chain",
                    appliesTo: {
                      next: {
                        typeBox: {
                          subtypes: ["Attack"],
                        },
                      },
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
        gain1Power: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    }),
  }),
});

export const {
  red: twinTwistersRed,
  yellow: twinTwistersYellow,
  blue: twinTwistersBlue,
} = twinTwisters.cards;
