import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/wave-of-reality.generated.ts";

/**
 * DYN214 Wave of Reality — Illusionist Arms, Ward 1 (no printed defense).
 *
 * Printed: When Wave of Reality is destroyed, create a Spectral Shield token.
 * Ward 1
 *
 * Model notes (hand-authored):
 * - Ward 1 (CR 8.3.20): if controller would be dealt damage, destroy this to
 *   prevent 1. No {d} — cannot defend; combat damage path is Ward only.
 * - destroy subject:self — "When Wave of Reality is destroyed" (not every
 *   destroy while equipped; Bone Vizier / Silken family honesty).
 * - create Spectral Shield under controller.
 */
export const waveOfReality = defineCard(fabCardIdentitiesByCanonicalId["w9D7zGdNGdhHJKQ78DFNF"], {
  keywords: [ward(1)],
  abilities: {
    whenWaveRealityIsDestroyedCreateSpectralShieldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spectral-shield",
          controller: "controller",
        },
      },
    },
  },
});
