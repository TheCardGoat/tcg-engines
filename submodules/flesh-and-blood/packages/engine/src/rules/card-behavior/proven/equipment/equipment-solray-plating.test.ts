/**
 * PEN180 Solray Plating — Light Chest d1 Blade Break.
 *
 * Printed:
 *   If you would be dealt damage, you may banish a card from your soul to
 *   prevent 1 of that damage. If you do, destroy this at the beginning of the
 *   end phase.
 *   Blade Break
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Continuous prevention with optionalCost banish-from-soul (not quell RP).
 * 2. ENGINE: optionalCost banish from soul was not in supportedCanonical /
 *    preventionApplies / apply path — only discard Instant / banish-self /
 *    steam. The defender now explicitly chooses whether to apply it and the
 *    soul card to banish. Wired soul banish + then destroy delay:end-phase via
 *    quell-pending-destroy end-turn cleanup (same shape as CR 8.3.19 quell).
 * 3. Empty soul → no prevent (full damage); plating stays until BB if used
 *    to defend without soul cost path.
 * 4. Blade Break d1 when defended.
 *
 * Status: ✅ soul-banish prevent 1 + EOT destroy; empty soul no prevent; BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { solrayPlating } from "../../../../../../cards/src/cards/equipment/solray-plating.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 1;

function advanceToOptionalReplacement(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let passes = 0; passes < 12; passes += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "option") return;
    if (decision) throw new Error(`Expected optional replacement choice, got ${decision.kind}.`);
    if (game.declareNoDefenseIfPending()) continue;
    const priorityPlayerId = game.getPriorityPlayerId();
    if (!priorityPlayerId) break;
    game.pass(priorityPlayerId);
  }
  throw new Error("Optional replacement choice was not reached.");
}

describe("solray-plating (PEN180)", () => {
  it("core mechanic: soul-banish → prevent 1; destroy at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [solrayPlating],
        soul: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    // Do not defend with plating — pure prevention path.
    advanceToOptionalReplacement(game);
    const choice = Defender.expectDecision("option");
    Defender.chooseOptions(choice.options[0]!.id);
    Defender.chooseTargets(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − prevent 1 = 3; soul card banished; plating still equipped.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("chest")).toContain(solrayPlating.canonicalId);

    // End phase destroys plating (pending-destroy from prevent path).
    game.as(dash).endTurn();
    expect(Defender.zone("chest")).not.toContain(solrayPlating.canonicalId);
    expect(Defender.zone("graveyard")).toContain(solrayPlating.canonicalId);
  });

  it("boundaries: empty soul → full damage, no destroy; BB d1; model", () => {
    const empty = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [solrayPlating],
        soul: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    empty.as(dash).attackWith(snatchRed);
    empty.helpers.resolveRestOfCombat();
    // Full 4 damage; plating remains.
    expect(empty.as(bravo).life()).toBe(LIFE - SNATCH);
    expect(empty.as(bravo).zone("chest")).toContain(solrayPlating.canonicalId);
    empty.as(dash).endTurn();
    // No prevent paid → not pending-destroy.
    expect(empty.as(bravo).zone("chest")).toContain(solrayPlating.canonicalId);

    // Blade Break when defended (no soul needed for BB lifecycle).
    const bb = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [solrayPlating],
        soul: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bb.as(dash).attackWith(snatchRed);
    bb.as(bravo).defendWith(solrayPlating);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(bravo).zone("graveyard")).toContain(solrayPlating.canonicalId);

    const a1 = solrayPlating.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      optionalCost: {
        class: "effect",
        type: "banish",
        from: "soul",
        count: 1,
      },
      duration: "while-in-arena",
      additionalModification: {
        type: "destroy",
        target: { selector: "self" },
        delay: "end-phase",
      },
    });
    expect(solrayPlating.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(solrayPlating.base.numeric.defense).toBe(1);
  });
});
