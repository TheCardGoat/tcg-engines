import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/soulbond-resolve.generated.ts";

/**
 * DTD047 Soulbond Resolve — Light Warrior Chest d2 Temper.
 *
 * Printed:
 *   When this defends, you may charge your hero's soul.
 *   The first time you would be dealt damage each turn, if you've charged
 *   this turn, prevent 1 of that damage.
 *   Temper
 *
 * Model notes (hand-authored):
 * - Defend trigger uses subject:self (Helm of Halo's Grace family).
 * - Charge picks an at-resolution hand card (not bare controller).
 * - Prevention is a static continuous leaf (not conditional-wrapped — the
 *   replacement engine only collects direct prevention/replacement effects).
 * - charged-this-turn is ability-level condition; times:1 + per-turn consumption
 *   for "first time each turn".
 */
export const soulbondResolve = defineCard(fabCardIdentitiesByCanonicalId["KPcKCKn8CpthtjNrk6fC8"], {
  keywords: [temper],
  abilities: {
    whenDefendsMayChargeHeroSSoul: {
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
          type: "optional",
          effect: {
            type: "charge",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
          },
        },
      },
      label: {
        name: "charge",
      },
    },
    firstTimeWouldBeDealtDamageEachTurnIf: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        times: 1,
        duration: "while-in-arena",
      },
      label: {
        name: "charge",
      },
    },
  },
});
