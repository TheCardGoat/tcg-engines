import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ticket-puncher.generated.ts";

/**
 * HVY204 Ticket Puncher — Generic Arms Blade Break (set-base {d}).
 *
 * Printed:
 *   Ticket Puncher's {d} is equal to the number of opposing heroes with
 *   greater {h} than you.
 *   Blade Break
 *
 * Model notes (hand-authored, 1v1 product; arms twin of HVY203 stadium-centerpiece):
 * - Continuous set-base defense = count opposing heroes with
 *   greater-life-than-controller. In 1v1 that is 0 or 1 (sole opponent).
 * - No printed defense value — base is supplied only by this continuous.
 * - Same pattern as Headliner Helm (HVY202) / Stadium Centerpiece (HVY203).
 */
export const ticketPuncher = defineCard(fabCardIdentitiesByCanonicalId["d8qcmDrkwJ7D6FnMjQDW9"], {
  keywords: [bladeBreak],
  abilities: {
    ticketPuncherSIsEqualNumberOpposingHeroesGreater: {
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
});
