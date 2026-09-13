/**
 * MPG006 Richter Scale — Guardian Chest d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Create 2 Seismic Surge tokens.
 *   Battleworn
 *
 * Reasoning (case-by-case):
 * 1. Action destroy-self spends 1 AP (no printed go again) → 0 AP after resolve.
 * 2. Creates exactly 2 Seismic Surge tokens under controller.
 * 3. Battleworn defend: d1 block, −1{d} counter, stays equipped at d0.
 * 4. Defend path does not create Seismic Surge tokens.
 *
 * Status: ✅ Action destroy → 2 Surge; battleworn lifecycle; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { richterScale } from "../../../../../../cards/src/cards/equipment/richter-scale.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function seismicSurgeCount(
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  return player.zone("arena").filter((id) => id === "token:seismic-surge").length;
}

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === richterScale.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("richter-scale (MPG006)", () => {
  it("core mechanic: Action destroy-self creates 2 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [richterScale],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(richterScale);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(richterScale.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(richterScale.canonicalId);
    expect(seismicSurgeCount(Bravo)).toBe(2);
    // No go again — Action spent the AP.
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("proven: battleworn d1 — defend contributes 1 then −1{d}, stays equipped; no Surge", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [richterScale],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    expect(chestDefense(game, Defender.id)).toBe(1);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(richterScale);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("chest")).toContain(richterScale.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(0);
    expect(seismicSurgeCount(Defender)).toBe(0);
  });

  it("model guard: Action destroy-self → create 2 seismic-surge; battleworn", () => {
    const a1 = richterScale.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "create-token",
      token: "seismic-surge",
      controller: "controller",
      count: 2,
    });
    expect(richterScale.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(richterScale.base.numeric.defense).toBe(1);
  });
});
