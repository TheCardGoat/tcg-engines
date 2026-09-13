import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hornet-s-sting.generated.ts";

/**
 * DYN152 Hornet's Sting — Ranger Arms d1 Blade Break.
 *
 * Printed: Whenever Hornet's Sting defends, reveal the top card of your deck.
 * If it's an arrow, deal 1 damage to the attacking hero or ally. Otherwise,
 * put it on the bottom of your deck. Blade Break
 *
 * Model notes (hand-authored):
 * - defend subject:self — co-defenders must not fire (Zap/Safe Haven family).
 * - Reveal top binds "it"; binding-matches Arrow → deal 1 generic to
 *   attacking-hero (1v1 sole attacker seat; ally branch is multiplayer-only).
 * - Non-arrow: move binding it deck bottom.
 * - Arrow stays on top after reveal (no move step).
 */
export const hornetSSting = defineCard(fabCardIdentitiesByCanonicalId["kHTFbHM7GGctRFhMm8hBg"], {
  keywords: [bladeBreak],
  abilities: {
    wheneverHornetSStingDefendsRevealTopDeckIf: {
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
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
              then: {
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "attacking-hero",
                },
              },
              else: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          ],
        },
      },
    },
  },
});
