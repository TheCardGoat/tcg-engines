import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/civic-duty.generated.ts";

/**
 * TCC031 Civic Duty — Guardian Chest d2 Temper.
 *
 * Printed:
 *   Whenever this defends, create a Vigor token under another hero's control.
 *   Temper
 *
 * Model notes (hand-authored; civic-peak twin):
 * - "this defends" requires subject:self so co-defenders do not fire.
 * - 1v1: another-hero is the sole opposing seat (no multi-hero chooser).
 */
export const civicDuty = defineCard(fabCardIdentitiesByCanonicalId["TwcL67rLrL9CfqgFdPF9t"], {
  keywords: [temper],
  abilities: {
    wheneverDefendsCreateVigorTokenUnderAnotherHeroS: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "another-hero",
        },
      },
    },
  },
});
