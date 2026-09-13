import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/emeritus-scolding.generated.ts";
export const emeritusScolding = definePitchFamily(fabPitchFamilies["emeritus-scolding"], {
  parameters: pitchMap({
    red: { damage: 4, opponentDamage: 6 },
    yellow: { damage: 3, opponentDamage: 5 },
    blue: { damage: 2, opponentDamage: 4 },
  }),
  abilities: ({ damage, opponentDamage }) => ({
    resolutionConditionalHasStatusNotTurnDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "has-status",
          status: "not-your-turn",
        },
        then: {
          type: "deal-damage",
          damageType: "arcane",
          amount: opponentDamage,
          target: { selector: "any-hero" },
        },
        else: {
          type: "deal-damage",
          damageType: "arcane",
          amount: damage,
          target: { selector: "any-hero" },
        },
      },
    },
  }),
});
export const {
  red: emeritusScoldingRed,
  yellow: emeritusScoldingYellow,
  blue: emeritusScoldingBlue,
} = emeritusScolding.cards;
