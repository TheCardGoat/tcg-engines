import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stadium-centerpiece.generated.ts";

/**
 * HVY203 Stadium Centerpiece — Generic Chest Blade Break (set-base {d}).
 *
 * Printed:
 *   Stadium Centerpiece's {d} is equal to the number of opposing heroes with
 *   greater {h} than you.
 *   Blade Break
 *
 * Model notes (hand-authored, 1v1 product):
 * - Continuous set-base defense = count opposing heroes with
 *   greater-life-than-controller. In 1v1 that is 0 or 1 (sole opponent).
 * - No printed defense value — base is supplied only by this continuous.
 * - Same pattern as Headliner Helm (HVY202) / Ticket Puncher limbs.
 */
export const stadiumCenterpiece = defineCard(
  fabCardIdentitiesByCanonicalId["L6FBCMGPMwNfTBBKrhqDT"],
  {
    keywords: [bladeBreak],
    abilities: {
      stadiumCenterpieceSIsEqualNumberOpposingHeroesGreater: {
        kind: "static",
        staticKind: "property",
        property: "defense",
        value: {
          type: "count",
          what: "heroes",
          player: "opponent",
          filter: {
            hasStatus: "greater-life-than-controller",
          },
        },
      },
    },
  },
);
