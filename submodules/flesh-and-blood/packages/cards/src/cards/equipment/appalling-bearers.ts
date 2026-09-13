import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/appalling-bearers.generated.ts";

/**
 * IAR056 Appalling Bearers — Shadow Necromancer Arms d0.
 *
 * Printed:
 *   Instant - Discard a zombie, destroy this: Prevent the next 2 damage that
 *   would be dealt to you this turn.
 *
 * Model notes (hand-authored; case-by-case):
 * - Mixed cost: discard 1 hand Zombie + destroy-self.
 * - Zombie is on the type line (types filter, same loose matching as Ally on
 *   Carrion Crown). Prior subtypes:["Zombie"] only checked typeBox.subtypes
 *   and could miss cards that place Zombie in types.
 * - Effect is this-turn fixed prevention 2 on controller (Constella Tiara /
 *   prevent-next-N family).
 */
export const appallingBearers = defineCard(
  fabCardIdentitiesByCanonicalId["jCfWzCbzWDBKmcPThjMcq"],
  {
    abilities: {
      instantDiscardZombieDestroyPreventNext2DamageWould: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "discard",
              count: 1,
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 2,
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
