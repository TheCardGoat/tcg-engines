/**
 * OUT094 Trench of Sunken Treasure — Ranger Chest d1 AB1 Blade Break.
 *
 * Printed:
 *   Once per Turn Instant - Put a face down card from your arsenal on the
 *   bottom of your deck: Gain {r}
 *   Arcane Barrier 1
 *   Blade Break
 *
 * Reasoning (case-by-case; hidden-agenda / mask-malicious move-to-deck family):
 * 1. Instant OPT: cost moves one face-down arsenal card to deck bottom → +1{r}.
 * 2. Empty arsenal / face-up-only arsenal cannot pay cost (illegal activate).
 * 3. Second activate same turn illegal (limit 1/turn).
 * 4. Blade Break d1: defend then destroy to GY.
 * 5. Model: move-to-deck from arsenal filter hasStatus face-down.
 *
 * Status: ✅ face-down arsenal bottom → {r}; empty/face-up/OPT; BB d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { trenchOfSunkenTreasure } from "../../../../../../cards/src/cards/equipment/trench-of-sunken-treasure.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("trench-of-sunken-treasure (OUT094)", () => {
  it("core mechanic: OPT Instant face-down arsenal → deck bottom + gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [trenchOfSunkenTreasure],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 0,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const arsenalId = Bravo.findCardInZone("arsenal", nimblismBlue);
    expect(game.getState().objects[arsenalId]?.markers.some((m) => m.kind === "face-down")).toBe(
      true,
    );
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(trenchOfSunkenTreasure);
    drain(game);

    expect(Bravo.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore + 1);
    // Bottom-of-deck is zone[0] in this engine (top is the high end).
    expect(Bravo.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    // Equipment stays equipped (not destroyed by the Instant).
    expect(Bravo.zone("chest")).toContain(trenchOfSunkenTreasure.canonicalId);
  });

  it("boundaries: empty/face-up arsenal illegal; OPT once/turn; BB d1; model", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [trenchOfSunkenTreasure],
        arsenal: [],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(trenchOfSunkenTreasure)).toThrow();

    // Face-up arsenal only — hasStatus face-down fails.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        chest: [trenchOfSunkenTreasure],
        arsenal: [nimblismBlue],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const upId = faceUp.as(bravo).findCardInZone("arsenal", nimblismBlue);
    faceUp.setObjectFaceDown(upId, false);
    // Explicit public fixture setup models a face-up arsenal card.
    expect(
      faceUp.getState().objects[upId]?.markers.some((m) => m.kind === "face-down") ?? false,
    ).toBe(false);
    expect(() => faceUp.as(bravo).activate(trenchOfSunkenTreasure)).toThrow();

    // OPT: first activate works; second same turn illegal.
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        chest: [trenchOfSunkenTreasure],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }, snatchRed],
        // Seating may only keep one arsenal slot — seed one face-down, then
        // re-seat for second? Arsenal is typically size 1. Use two turns? No —
        // OPT is once per turn: first succeeds, second with another face-down
        // would need two arsenal cards. FAB arsenal is usually 1.
        // Prove OPT by: first succeeds → no arsenal left → second throws either
        // for OPT or empty arsenal. Use two sequential activates with re-seed.
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    opt.as(bravo).activate(trenchOfSunkenTreasure);
    drain(opt);
    expect(opt.as(bravo).resourcePoints()).toBe(1);
    // No second face-down arsenal; activate illegal (OPT and/or empty cost).
    expect(() => opt.as(bravo).activate(trenchOfSunkenTreasure)).toThrow();

    // Blade Break d1.
    const bb = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [trenchOfSunkenTreasure],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(trenchOfSunkenTreasure);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(bb.as(dash).zone("chest")).not.toContain(trenchOfSunkenTreasure.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(trenchOfSunkenTreasure.canonicalId);

    const a1 = trenchOfSunkenTreasure.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
      expect(a1.cost).toMatchObject({
        class: "effect",
        type: "move-to-deck",
        from: "arsenal",
        position: "bottom",
        count: 1,
        filter: { hasStatus: "face-down" },
      });
      expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    }
    expect(trenchOfSunkenTreasure.base.numeric.defense).toBe(1);
    expect(trenchOfSunkenTreasure.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(
      trenchOfSunkenTreasure.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
  });
});
