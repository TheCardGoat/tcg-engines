import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlets-of-iron-will.generated.ts";

/**
 * HVY053 Gauntlets of Iron Will — Guardian Arms d2 Temper.
 *
 * Printed:
 *   When this defends, the next time an attack would gain {p} this chain link,
 *   instead it gains that much minus 1.
 *   Temper
 *
 * Model notes (hand-authored; case-by-case):
 * - Prior model: defend (no subject) → replaces "gain" targeting self equipment
 *   with permanent duration — never matched continuous power applications and
 *   would have rewritten the wrong object.
 * - Remodel: defend subject:self → register one-shot power-gain replacement
 *   (DSL name "gain") for this-chain-link; engine rewrites continuous power
 *   contributions by −1 (Flourish/Thrive family).
 * - consumeOnUse defaults true on register-replacement → "next time" only.
 */
export const gauntletsOfIronWill = defineCard(
  fabCardIdentitiesByCanonicalId["z6GNFrJctrhjhmJMLFQt9"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsNextTimeAttackWouldGainChainLink: {
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
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "gain",
            },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "subtract",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            duration: "this-chain-link",
          },
        },
      },
    },
  },
);
