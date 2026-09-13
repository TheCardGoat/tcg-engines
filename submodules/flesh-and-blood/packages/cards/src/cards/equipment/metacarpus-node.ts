import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/metacarpus-node.generated.ts";

/**
 * CRU161 Metacarpus Node — Wizard Arms d0 Arcane Barrier 1.
 *
 * Printed: Whenever you play a card with an effect that deals arcane damage,
 * you may pay {r}. If you do, instead it deals that much arcane damage plus 1,
 * and destroy Metacarpus Node at the beginning of the end phase. Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - Prior hasKeyword "an-effect-that-deals-arcane-damage" is English residue —
 *   never matches. Engine already has hasStatus "arcane-damage-effect" that
 *   walks ability ASTs for deal-damage/arcane (Blaze Firemind family).
 * - actor:controller — only your plays, not the opponent's.
 * - Replacement amount uses property "count" (damage amount), not "power"
 *   (same shape as Wizard non-attack "plus 1" residual models).
 * - destroy delay:end-phase rewrites to delayed-trigger in proposals.
 */
export const metacarpusNode = defineCard(fabCardIdentitiesByCanonicalId["RDTDDzfpjwLc9QrLWhqtB"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    wheneverPlayEffectDealsArcaneDamageMayPayIf: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "arcane-damage-effect",
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
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "replacement",
                replacementKind: "standard",
                replaces: {
                  name: "damage",
                  damageType: "arcane",
                },
                modification: {
                  type: "modify-numeric",
                  property: "count",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
                duration: "this-turn",
              },
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
                delay: "end-phase",
              },
            ],
          },
        },
      },
    },
  },
});
