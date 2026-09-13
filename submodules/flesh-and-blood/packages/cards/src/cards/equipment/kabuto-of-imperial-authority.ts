import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/kabuto-of-imperial-authority.generated.ts";

/**
 * HNT115 Kabuto of Imperial Authority — Warrior Head d2 Blade Break.
 *
 * Printed: When this defends, until end of turn, opponents can't attack with
 * weapons. Blade Break
 *
 * Model notes (hand-authored):
 * - defend subject:self so co-defenders do not arm this.
 * - filter.types:["Weapon"] — Weapon is a CR type (FAB_TYPES), not a subtype.
 *   Parser wordFilter("weapon") historically emitted subtypes:["Weapon"], which
 *   never matches live type-boxes.
 * - action:"attack" continuous restrict binds opponents of the effect
 *   controller (activation quote checks rules("attack") for abilityType attack).
 */
export const kabutoOfImperialAuthority = defineCard(
  fabCardIdentitiesByCanonicalId["QmJTKzcT6dtHwqktKqBFk"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsUntilEndTurnOpponentsCanTAttack: {
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
            type: "rule-modification",
            mode: "restrict",
            action: "attack",
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
);
