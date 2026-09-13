import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/punch-above-your-weight.generated.ts";

export const punchAboveYourWeight = definePitchFamily(fabPitchFamilies["punch-above-your-weight"], {
  parameters: {
    red: { powerBonus: 5 },
    yellow: { powerBonus: 4 },
    blue: { powerBonus: 3 },
  },
  abilities: ({ powerBonus }) => ({
    triggeredAttackOptionalPayResourcesModifyNumericPowerThisTurn: {
      kind: "static",
      staticKind: "triggered",
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            payer: "controller",
          },
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: powerBonus,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: punchAboveYourWeightRed,
  yellow: punchAboveYourWeightYellow,
  blue: punchAboveYourWeightBlue,
} = punchAboveYourWeight.cards;
