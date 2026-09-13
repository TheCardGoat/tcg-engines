import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/prized-galea.generated.ts";

/**
 * HVY098 Prized Galea — Warrior Head d2 Temper, Olympia Specialization.
 *
 * Printed: Attack Reaction - {r}, destroy this: Target weapon attack you
 * control wagers a Gold token with the defending hero. Temper
 *
 * Model notes (hand-authored):
 * - this-attack resolves the live attack proxy back to its physical weapon.
 * - wager stake gold creates Gold token for the stake (BET004 path).
 */
export const prizedGalea = defineCard(fabCardIdentitiesByCanonicalId["mRCfW6wBLjzRzjnNrKqQn"], {
  keywords: [
    {
      name: "specialization",
      hero: "Olympia",
    },
    temper,
  ],
  abilities: {
    attackReactionDestroyTargetWeaponAttackControlWagersGold: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "wager",
        stake: "gold",
        attacker: {
          selector: "this-attack",
          filter: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
  },
});
