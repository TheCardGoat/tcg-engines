import { describe, expect, it } from "vitest";
import {
  walkAbilityEffects,
  type FabEffect,
  type FleshAndBloodCard,
} from "@tcg/flesh-and-blood-types";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";

/**
 * CR 1.8.5 / 1.8.5c: only printed "target …" parameters are declared, and
 * they never name hidden cards. Subjects in private zones (deck / hand /
 * arsenal) are determined at resolution from ONE declared hero's zone. A
 * multi-seat object scan over a private zone materializes hidden cards from
 * every seat as choice candidates — disclosing hidden-zone contents the
 * effect never looked at (CR 8.5.11, CR 1.8.6b) and turning "target hero"
 * cards into card choices. Author those with `playerTarget` +
 * `playerTargetBinding` (hero declared on the stack, card scoped to that
 * hero) — Scout the Periphery / Pry are the reference shapes.
 *
 * Not flagged here (different mechanisms, verified against the engine):
 * - `random: true` and `count: { type: "all" }` scans present no choice.
 * - `player: "each…" / "another-hero"` rows are CR 1.8.6a per-hero
 *   determination shapes with their own engine guards.
 * - Fixed-seat private-zone effects (`player: "opponent"` / `"controller"`
 *   …) where the zone owner answers any choice (Winter's Bite, Brain
 *   Freeze, Pry's draw) — forced-unique in 1v1, no disclosure.
 * - Public-zone object scans (`hero` / `permanent` / `graveyard`).
 *
 * A positioned deck-top scan with NO seat information is equally wrong:
 * `player` defaults to the controller, so printed "target hero's deck"
 * silently becomes the caster's own deck top (the Scrub the Deck bug).
 * Position + private zone + no `player` / `playerTarget` /
 * `playerTargetBinding` fails the audit; later leaves of the same layer
 * reusing a declared hero satisfy it via `playerTargetBinding` alone
 * (Seduce Secrets' deck-top leaf).
 */

const PRIVATE_ZONES: ReadonlySet<string> = new Set(["deck", "hand", "arsenal"]);

/**
 * Disclosure-class exemptions. May shrink, never grow: each entry is a known
 * "any"-seat hidden-zone pick. The engine now anonymizes face-down decision
 * candidates (FabTargetCandidate.hidden, CR 1.8.6b), so these stay
 * disclosure-safe without the playerTarget contract; the authoring shape
 * itself remains the sanctioned hidden determination.
 */
const DISCLOSURE_CLASS_EXEMPTIONS: ReadonlySet<string> = new Set(["emboldened-blade"]);

interface AuditedTarget {
  readonly selector?: string;
  readonly zones?: readonly string[];
  readonly player?: unknown;
  readonly playerTarget?: unknown;
  readonly playerTargetBinding?: string;
  readonly position?: string;
  readonly random?: boolean;
  readonly count?: unknown;
}

function privateZoneScanViolations(card: FleshAndBloodCard): string[] {
  const violations: string[] = [];
  for (const ability of card.base.abilities ?? []) {
    walkAbilityEffects(ability, (effect: FabEffect) => {
      const target =
        "target" in effect && effect.target && typeof effect.target === "object"
          ? (effect.target as AuditedTarget)
          : undefined;
      const hasSeat =
        target?.player !== undefined ||
        target?.playerTarget !== undefined ||
        target?.playerTargetBinding !== undefined;
      if (
        target?.selector === "object" &&
        !target.playerTarget &&
        (target.zones ?? []).some((zone) => PRIVATE_ZONES.has(zone))
      ) {
        if (
          target.player === "any" &&
          target.random !== true &&
          (target.count === undefined ||
            typeof target.count === "number" ||
            (typeof target.count === "object" &&
              target.count !== null &&
              "type" in target.count &&
              target.count.type !== "all")) &&
          !DISCLOSURE_CLASS_EXEMPTIONS.has(card.slug.replace(/-(red|yellow|blue)$/, ""))
        ) {
          violations.push(`${card.slug}:${ability.id}`);
        }
        // Positioned private-zone scan with no seat at all: `player`
        // defaults to the controller, mis-scoping printed "target hero".
        if (!hasSeat && target.position !== undefined) {
          violations.push(`${card.slug}:${ability.id}`);
        }
      }
      return effect;
    });
  }
  return violations;
}

describe("private-zone target authoring", () => {
  it("never scans a private zone across seats without a declared hero", () => {
    const violations: string[] = [];
    for (const card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
      violations.push(...privateZoneScanViolations(card));
    }
    expect(violations).toEqual([]);
  });
});
