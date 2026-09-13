import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shock-charmers.generated.ts";

/**
 * ELE173 Shock Charmers — Lightning Arms d0 Spellvoid 2.
 *
 * Printed: Instant - {r}{r}: The next time an attack action card you control
 * hits a hero this turn, it deals 1 damage to them. Spellvoid 2
 *
 * Model notes (hand-authored):
 * - Prior model was immediate deal-damage with appliesTo English residue
 *   (subtypes Card/You/Control) — never armed a delayed hit clause.
 * - delayed-trigger one-shot in this turn: hit
 *   filter types Action+Attack (AAC type-box), actor controller.
 * - Do NOT set event.target:"hero" together with card-identity filters:
 *   trigger-matcher applies those filters to the hero object when both are
 *   present (Guardian-hit family), so AAC filters would never match. 1v1 AAC
 *   hits are hero-targeted; printed "a hero" is covered by attack-target.
 * - "it deals 1 damage to them": source = binding it (the AAC), target =
 *   attack-target (the hero that was hit).
 * - Printed "this turn" is the play window; one-shot consume matches "next".
 *   duration:this-turn would multi-fire (wrong).
 */
export const shockCharmers = defineCard(fabCardIdentitiesByCanonicalId["JkPgFzHTpzdNfzJCwQCmt"], {
  keywords: [spellvoid(2)],
  abilities: {
    instantNextTimeAttackActionControlHitsHeroTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "delayed-trigger",
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
              filter: attackActionFilter(),
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "attack-target",
            },
            source: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  },
});
