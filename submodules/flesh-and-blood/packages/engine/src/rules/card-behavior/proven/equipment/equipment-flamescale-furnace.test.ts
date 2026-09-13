/**
 * UPR084 Flamescale Furnace — Draconic Chest d2 Temper.
 *
 * Printed:
 *   Once per Turn Instant - {r}: Gain {r} for each red card in your pitch zone.
 *   Activate this ability only if you've played a red card this turn.
 *   Temper
 *
 * Reasoning (hand-authored; sash-of-sandikai / overbearing-presence family):
 * 1. Gate "played a red card this turn" is color, not type. Prior types:["Red"]
 *    never matched — remodeled color:["red"].
 * 2. Core: after playing Snatch (red), pay 1{r} → gain N{r} for N reds in pitch.
 * 3. Boundaries: no red play illegal; yellow-only play illegal; empty pitch
 *    after red play gains 0 (net −1); OPT second activate illegal; Temper d2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { flamescaleFurnace } from "../../../../../../cards/src/cards/equipment/flamescale-furnace.ts";
import { snatchYellow } from "../../../../../../cards/src/cards/actions/snatch.ts";

const LIFE = 20;
const SNATCH = 4;
const PLATE_D = 2;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("flamescale-furnace (UPR084)", () => {
  it("core mechanic: after red play, pay 1{r} → gain reds-in-pitch {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        hand: [snatchRed],
        // Two reds already in pitch for the gain amount.
        pitch: [snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("pitch").filter((id) => id === snatchRed.canonicalId).length).toBe(2);

    // Play red AAC to open the activate gate.
    Bravo.play(snatchRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Pay 1{r}, gain 2 for two reds in pitch → net +1.
    expect(Bravo.resourcePoints()).toBe(1);
    Bravo.activate(flamescaleFurnace);
    drain(game);
    expect(Bravo.resourcePoints()).toBe(2);
    // OPT Instant does not destroy the equipment.
    expect(Bravo.zone("chest")).toContain(flamescaleFurnace.canonicalId);
  });

  it("boundaries: no-red/yellow/empty-pitch/OPT/Temper; model color red", () => {
    // No red play: illegal even with reds in pitch.
    const noPlay = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        pitch: [snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noPlay.as(bravo).activate(flamescaleFurnace)).toThrow();

    // Yellow play does not open red gate.
    const yellowOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        hand: [snatchYellow],
        pitch: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    yellowOnly.as(bravo).play(snatchYellow);
    drain(yellowOnly);
    yellowOnly.helpers.resolveRestOfCombat();
    drain(yellowOnly);
    expect(() => yellowOnly.as(bravo).activate(flamescaleFurnace)).toThrow();

    // Red play + empty pitch: pay 1, gain 0 → RP ends 0.
    const emptyPitch = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    emptyPitch.as(bravo).play(snatchRed);
    drain(emptyPitch);
    emptyPitch.helpers.resolveRestOfCombat();
    drain(emptyPitch);
    emptyPitch.as(bravo).activate(flamescaleFurnace);
    drain(emptyPitch);
    expect(emptyPitch.as(bravo).resourcePoints()).toBe(0);

    // OPT: second activate same turn illegal.
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        hand: [snatchRed],
        pitch: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    opt.as(bravo).play(snatchRed);
    drain(opt);
    opt.helpers.resolveRestOfCombat();
    drain(opt);
    opt.as(bravo).activate(flamescaleFurnace);
    drain(opt);
    expect(() => opt.as(bravo).activate(flamescaleFurnace)).toThrow();

    // Temper d2 leaves seat.
    const temper = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [flamescaleFurnace],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    temper.as(dash).attackWith(snatchRed);
    temper.as(bravo).defendWith(flamescaleFurnace);
    drain(temper);
    temper.helpers.resolveRestOfCombat();
    drain(temper);
    expect(temper.as(bravo).life()).toBe(LIFE - (SNATCH - PLATE_D));
    expect(temper.as(bravo).zone("chest")).toContain(flamescaleFurnace.canonicalId);

    // Blue in pitch does not count toward gain amount.
    const bluePitch = FabTestEngine.start(
      {
        hero: bravo,
        chest: [flamescaleFurnace],
        hand: [snatchRed],
        pitch: [nimblismBlue, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bluePitch.as(bravo).play(snatchRed);
    drain(bluePitch);
    bluePitch.helpers.resolveRestOfCombat();
    drain(bluePitch);
    bluePitch.as(bravo).activate(flamescaleFurnace);
    drain(bluePitch);
    // Pay 1, gain 0 blues → 0.
    expect(bluePitch.as(bravo).resourcePoints()).toBe(0);

    const a1 = flamescaleFurnace.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
      expect(a1.cost).toMatchObject({ type: "resources", amount: 1 });
      expect(a1.condition).toMatchObject({
        type: "played-this",
        per: "turn",
        filter: { color: ["red"] },
      });
      if (a1.condition && a1.condition.type === "played-this") {
        expect(a1.condition.filter).not.toHaveProperty("types");
      }
      expect(a1.effect).toMatchObject({
        type: "gain-resources",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "pitch",
          filter: { color: ["red"] },
        },
      });
    }
    expect(flamescaleFurnace.base.numeric.defense).toBe(2);
    expect(flamescaleFurnace.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "temper" })]),
    );
  });
});
