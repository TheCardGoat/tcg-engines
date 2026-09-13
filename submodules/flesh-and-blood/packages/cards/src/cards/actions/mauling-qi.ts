import { combo } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mauling-qi.generated.ts";

export const maulingQi = definePitchFamily(fabPitchFamilies["mauling-qi"], {
  keywords: [combo],
  abilities: () => ({
    hitsCrouchingTigerLastAttackCombatChainDeal1DamageOpposing: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "last-attack-this-combat-chain",
          names: ["Crouching Tiger"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hero"],
            count: {
              type: "all",
            },
          },
        },
      },
      label: {
        name: "combo",
        params: {
          names: ["Crouching Tiger"],
        },
      },
    },
  }),
});

export const { red: maulingQiRed } = maulingQi.cards;
