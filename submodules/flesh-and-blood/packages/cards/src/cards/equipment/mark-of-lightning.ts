import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mark-of-lightning.generated.ts";

/**
 * ELE174 Mark of Lightning — Lightning Arms d0.
 *
 * Printed: Whenever a Lightning or Elemental attack you control is defended by
 * a card from hand, you may destroy Mark of Lightning. If you do, the attack
 * deals 1 damage to the defending hero.
 *
 * Model notes (hand-authored):
 * - defend from hand, actor opponent (defending player).
 * - Prior filter put Lightning|Elemental on the **defender** (primary of defend
 *   is the defending card). Wrong: printed filters the **attack**.
 * - Defend events bind `attack` in event.bindings; trigger.state binding-matches
 *   that binding with Lightning|Elemental supertypes (talent vocabulary).
 * - optional destroy self → deal 1 generic to defending-hero.
 */
export const markOfLightning = defineCard(fabCardIdentitiesByCanonicalId["FRDf9rPtwMg7MjfK6wWNP"], {
  abilities: {
    wheneverLightningElementalAttackControlIsDefendedByFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
          origin: ["hand"],
        },
        state: {
          type: "binding-matches",
          binding: "attack",
          filter: {
            or: [
              {
                typeBox: {
                  supertypes: ["Lightning"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Elemental"],
                },
              },
            ],
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "defending-hero",
            },
          },
        },
      },
    },
  },
});
