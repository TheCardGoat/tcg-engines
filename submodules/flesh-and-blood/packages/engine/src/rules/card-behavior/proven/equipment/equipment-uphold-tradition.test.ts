/**
 * ENG005 Uphold Tradition — Mystic Illusionist Arms, Cloaked + Ward 1.
 *
 * Printed:
 *   Cloaked
 *   Instant - {r}, turn this face-up: Put a +1{p} counter on an aura you
 *   control with ward.
 *   Ward 1
 *
 * Reasoning (hand-authored; case-by-case; ENG003 sibling):
 * 1. Cloaked seats face-down; Instant pays {r} + turn-face-up.
 * 2. Remodel filter subtypes:Aura → types:Aura (truths-retold dead-filter
 *    lesson) + hasKeyword ward.
 * 3. Happy: Spectral Shield in arena → activate → +1{p} counter; arms stay
 *    equipped face-up.
 * 4. Boundary: already face-up → turn-face-up cost illegal.
 * 5. Boundary: 0 RP illegal; empty arena (no warded aura) — cost may still
 *    resolve with no counter target.
 * 6. Keywords: cloaked + ward(1).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { upholdTradition } from "../../../../../../cards/src/cards/equipment/uphold-tradition.ts";
import { spectralShield } from "../../../../../../cards/src/cards/tokens/spectral-shield.ts";

const LIFE = 20;

function powerCounterCount(
  game: ReturnType<typeof FabTestEngine.start>,
  instanceId: string,
): number {
  const rec = game.getState().objects[instanceId];
  if (!rec) return 0;
  return rec.counters.reduce((sum, c) => {
    if (c.kind === "numeric" && c.property === "power" && c.value === 1) {
      return sum + c.count;
    }
    return sum;
  }, 0);
}

describe("uphold-tradition (ENG005)", () => {
  it("core mechanic: cloaked Instant {r}+face-up → +1{p} on warded aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [upholdTradition],
        arena: [spectralShield],
        hand: [],
        deck: 4,
        resourcePoints: 1,
        actionPoints: 1,
        life: LIFE,
      },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const armsId = game.getState().containers.zonesByPlayerId[Bravo.id]!.arms[0]!;
    const arenaIds = game.getState().containers.zonesByPlayerId[Bravo.id]!.arena;
    const shieldId = arenaIds.find(
      (id) => game.getState().objects[id]?.canonicalId === spectralShield.canonicalId,
    )!;

    // Cloaked seats face-down.
    expect(game.objectState(armsId)?.faceDown).toBe(true);
    expect(powerCounterCount(game, shieldId)).toBe(0);

    Bravo.activate(upholdTradition);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: spectralShield.canonicalId,
      ordering: "listed",
    });

    // Turned face-up as cost; still equipped.
    expect(game.objectState(armsId)?.faceDown).not.toBe(true);
    expect(Bravo.zone("arms")).toContain(upholdTradition.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    // +1{p} counter on Spectral Shield.
    expect(powerCounterCount(game, shieldId)).toBe(1);
    expect(game.committedEvents().some((e) => e.name === "numeric-counter-added")).toBe(true);
  });

  it("boundaries: face-up illegal; 0 RP illegal; empty arena; model types:Aura+ward", () => {
    // Already face-up → cannot pay turn-face-up.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        arms: [{ card: upholdTradition, state: { faceDown: false } }],
        arena: [spectralShield],
        hand: [],
        deck: 4,
        resourcePoints: 1,
        actionPoints: 1,
        life: LIFE,
      },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => faceUp.as(bravo).activate(upholdTradition)).toThrow();

    // 0 RP illegal.
    const noRp = FabTestEngine.start(
      {
        hero: bravo,
        arms: [upholdTradition],
        arena: [spectralShield],
        hand: [],
        deck: 4,
        resourcePoints: 0,
        actionPoints: 1,
        life: LIFE,
      },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => noRp.as(bravo).activate(upholdTradition)).toThrow();

    // Empty arena: cost can still resolve (face-up + RP); no counter added.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [upholdTradition],
        arena: [],
        hand: [],
        deck: 4,
        resourcePoints: 1,
        actionPoints: 1,
        life: LIFE,
      },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    empty.as(bravo).activate(upholdTradition);
    empty.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
      ordering: "listed",
    });
    expect(empty.as(bravo).zone("arms")).toContain(upholdTradition.canonicalId);
    expect(empty.committedEvents().some((e) => e.name === "numeric-counter-added")).toBe(false);

    const a1 = upholdTradition.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
      });
      expect(a1.effect).toMatchObject({
        type: "add-counter",
        counter: { kind: "numeric", value: 1, property: "power" },
        target: {
          zones: ["permanent"],
          filter: { typeBox: { subtypes: ["Aura"] }, hasKeyword: "ward" },
        },
      });
    }
    expect(upholdTradition.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(
      upholdTradition.base.keywords?.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(upholdTradition.base.numeric.defense).toBeUndefined();
  });
});
