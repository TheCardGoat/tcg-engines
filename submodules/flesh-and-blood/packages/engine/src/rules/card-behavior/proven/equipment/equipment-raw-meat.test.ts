/**
 * HVY011 Raw Meat — Brute Chest d0 Temper.
 *
 * Printed:
 *   If you control an Agility token, this gets +1{d}.
 *   If you control a Might token, this gets +1{d}.
 *   Temper
 *
 * Reasoning (case-by-case):
 * 1. Continuous control-object gates for Agility / Might tokens — duration
 *    was this-turn (drops EOT while token remains). Fixed permanent re-eval
 *    (lignum / red-alert family).
 * 2. Each token stacks +1{d} (both → d2).
 * 3. Temper on base d0 with Agility (d1): defend contributes 1, then −1{d}
 *    counter → 0 and destroy.
 * 4. No tokens: base d0; defend contributes 0 and Temper destroys.
 *
 * Status: ✅ Agility/Might +d continuous; both stack; Temper destroy; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { rawMeat } from "../../../../../../cards/src/cards/equipment/raw-meat.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === rawMeat.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("raw-meat (HVY011)", () => {
  it("proven: base d0 with Temper seats; no tokens → d0", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rawMeat],
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("chest")).toContain(rawMeat.canonicalId);
    expect(rawMeat.base.numeric.defense).toBe(0);
    expect(chestDefense(game, Bravo.id)).toBe(0);
  });

  it("core mechanic: Agility token → +1{d}; Might alone → +1{d}; both → +2{d}", () => {
    const agilityOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rawMeat],
        arena: [fabToken("agility")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(agilityOnly, agilityOnly.as(bravo).id)).toBe(1);

    const mightOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rawMeat],
        arena: [fabToken("might")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(mightOnly, mightOnly.as(bravo).id)).toBe(1);

    const both = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rawMeat],
        arena: [fabToken("agility"), fabToken("might")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(both, both.as(bravo).id)).toBe(2);
  });

  it("core mechanic: with Agility, defend for d1 then Temper destroy", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [rawMeat],
        arena: [fabToken("agility")],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    expect(chestDefense(game, Defender.id)).toBe(1);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(rawMeat);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − d1 = 3 damage; Temper −1 then d0 → destroy.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("chest")).not.toContain(rawMeat.canonicalId);
    expect(Defender.zone("graveyard")).toContain(rawMeat.canonicalId);
  });

  it("boundaries: no tokens, defend d0 then Temper destroy", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [rawMeat],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(rawMeat);
    game.helpers.resolveRestOfCombat();

    // d0 contribute 0; Temper destroys at 0.
    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.zone("graveyard")).toContain(rawMeat.canonicalId);
  });

  it("model guard: continuous permanent + control Agility/Might Token", () => {
    const a1 = rawMeat.base.abilities?.[0];
    const a2 = rawMeat.base.abilities?.[1];
    expect(a1?.kind).toBe("static");
    expect(a2?.kind).toBe("static");
    if (a1?.kind !== "static" || a2?.kind !== "static" || !a1.effect || !a2.effect) return;

    expect(a1.condition).toMatchObject({
      type: "control-object",
      filter: { name: "Agility", typeBox: { metatypes: ["Token"] } },
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      duration: "permanent",
    });

    expect(a2.condition).toMatchObject({
      type: "control-object",
      filter: { name: "Might", typeBox: { metatypes: ["Token"] } },
    });
    expect(a2.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      duration: "permanent",
    });
  });
});
