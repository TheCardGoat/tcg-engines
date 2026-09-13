import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rush-of-power.generated.ts";

export const rushOfPower = definePitchFamily(fabPitchFamilies["rush-of-power"], {
  abilities: () => ({
    hasKeywordGoAgainModifyNumericPowerThisTurnQuickstrike: {
      kind: "resolution",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
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
      label: {
        name: "quickstrike",
      },
    },
    triggeredHitDealDamage: {
      kind: "static",
      staticKind: "triggered",
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
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const {
  red: rushOfPowerRed,
  yellow: rushOfPowerYellow,
  blue: rushOfPowerBlue,
} = rushOfPower.cards;
