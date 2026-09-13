import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/robe-of-autumn-s-fall.generated.ts";

/**
 * ASR004 Robe of Autumn's Fall — Ninja Chest d0 Arcane Barrier 1.
 *
 * Printed: When an Edge of Autumn you control hits, you may destroy this. If
 * you do, gain {r}. Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - Hit filter by printed name "Edge of Autumn" — prior parser residue used
 *   subtypes Edge/Of/Autumn (never match type-boxes).
 * - Optional destroy self → then gain {r} (if-you-do).
 * - actor:controller — only your Edge of Autumn.
 */
export const robeOfAutumnSFall = defineCard(
  fabCardIdentitiesByCanonicalId["W99DkNW9tQLbq6w6prDQB"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      whenEdgeAutumnControlHitsMayDestroyIfDo: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Edge of Autumn",
              },
              bindAs: "it",
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
              type: "gain-resources",
              amount: 1,
            },
          },
        },
      },
    },
  },
);
