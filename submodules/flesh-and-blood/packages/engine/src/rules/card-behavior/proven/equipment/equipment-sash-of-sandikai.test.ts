/**
 * FAI004 Sash of Sandikai — Draconic Chest d0.
 *
 * Printed:
 *   Instant - Destroy Sash of Sandikai: Gain {r}. Activate this ability only if
 *   you've played a red card this turn.
 *
 * Reasoning (case-by-case):
 * 1. Gate is "played a red card this turn" — color, not type. Prior model used
 *    types:["Red"] which is not FAB_TYPES vocabulary (assertTypeLineValue) and
 *    never matches. Fixed to color:["red"] (Dromai sibling).
 * 2. Instant destroy-self → +1{r}; no AP cost. After red play (Snatch) legal;
 *    without red (or only yellow) illegal.
 * 3. d0 seat has no temper/bladeBreak.
 *
 * Status: ✅ Instant destroy → +1{r} after red play; no-red / yellow-only illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { sashOfSandikai } from "../../../../../../cards/src/cards/equipment/sash-of-sandikai.ts";
import { snatchYellow } from "../../../../../../cards/src/cards/actions/snatch.ts";

describe("sash-of-sandikai (FAI004)", () => {
  it("proven: Instant Evo-less Chest seats at d0", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [sashOfSandikai],
        life: 20,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    expect(Dash.zone("chest")).toContain(sashOfSandikai.canonicalId);
    expect(sashOfSandikai.base.numeric.defense).toBe(0);
  });

  it("boundaries: Instant activate illegal without playing a red card this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [sashOfSandikai],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    expect(() => Dash.activate(sashOfSandikai)).toThrow();
    expect(Dash.zone("chest")).toContain(sashOfSandikai.canonicalId);
  });

  it("boundaries: playing only a yellow card does not open the red gate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [sashOfSandikai],
        hand: [snatchYellow],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Snatch yellow is free cost 0 — play it; color is yellow, not red.
    Dash.play(snatchYellow);
    game.helpers.resolveRestOfCombat();

    expect(() => Dash.activate(sashOfSandikai)).toThrow();
    expect(Dash.zone("chest")).toContain(sashOfSandikai.canonicalId);
  });

  it("core mechanic: after playing a red card, Instant destroy → +1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [sashOfSandikai],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Play red AAC (Snatch cost 0) so played-this color red stamps.
    Dash.play(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(0);
    Dash.activate(sashOfSandikai);
    game.passBoth();

    expect(Dash.zone("chest")).not.toContain(sashOfSandikai.canonicalId);
    expect(Dash.zone("graveyard")).toContain(sashOfSandikai.canonicalId);
    expect(Dash.resourcePoints()).toBe(1);
  });

  it("model guard: Instant destroy-self + played-this color red (not types Red)", () => {
    const a1 = sashOfSandikai.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;

    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "played-this",
      per: "turn",
      filter: { color: ["red"] },
      comparison: { op: "gte", value: 1 },
    });
    // Explicit: not the dead types:["Red"] residue.
    if (a1.condition && a1.condition.type === "played-this") {
      expect(a1.condition.filter).not.toHaveProperty("types");
    }
    expect(a1.effect).toMatchObject({
      type: "gain-resources",
      amount: 1,
    });
  });
});
