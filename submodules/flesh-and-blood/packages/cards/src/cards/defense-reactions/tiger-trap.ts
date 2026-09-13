import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/tiger-trap.generated.ts";

export const tigerTrap = definePitchFamily(fabPitchFamilies["tiger-trap"], {
  abilities: () => ({
    preventAttackPowerGains: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "combat-chain-attack-count",
          player: "attacking-hero",
          power: "greater-than-base",
          comparison: {
            op: "gte",
            value: 3,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "gain-power",
          filter: {
            // "Attacks" includes attack-proxies created by weapons and
            // allies, whose physical source does not have the Attack subtype.
            hasStatus: "attacking",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: tigerTrapRed } = tigerTrap.cards;
