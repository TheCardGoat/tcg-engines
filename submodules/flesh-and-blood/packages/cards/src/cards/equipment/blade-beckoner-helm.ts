import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blade-beckoner-helm.generated.ts";

/**
 * HNT216 Blade Beckoner Helm — Generic Head d1 Guardwell.
 *
 * Printed: This gets +1{d} while defending a weapon attack. Guardwell
 *
 * Model notes (hand-authored):
 * - Prefer ability.condition + direct modify-numeric (while-style continuous)
 *   over effect.conditional — same atom condition path, clearer "while".
 * - defending-a-weapon-attack uses combat.defending + attack types Weapon;
 *   continuous condition eval falls back to source (self) when no subject.
 * - Guardwell: −1{d} counters equal to defense value on close (not destroy).
 */
export const bladeBeckonerHelm = defineCard(
  fabCardIdentitiesByCanonicalId["7bLqk7cJF877QFfzBcGWL"],
  {
    keywords: [guardwell],
    abilities: {
      gets1WhileDefendingWeaponAttack: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "defending-a-weapon-attack",
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  },
);
