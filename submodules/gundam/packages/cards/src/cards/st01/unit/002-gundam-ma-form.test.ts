import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st01GundamMaForm002 } from "./002-gundam-ma-form.ts";

describe("Gundam (MA Form) (ST01-002)", () => {
  it("【When Paired･(White Base Team) Pilot】 draws 1 when a White Base Team pilot is paired", () => {
    const wbPilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [wbPilot],
      play: [st01GundamMaForm002],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.assignPilot(wbPilot, st01GundamMaForm002));

    // Pilot leaves hand (-1), whenPaired trigger draws 1 (+1) → net zero.
    expect(p1.getHand().length).toBe(handBefore);
    // But deck should have lost one card (5 → 4) proving the draw fired.
    const deckKey = `deck:${PLAYER_ONE}`;
    expect(engine.getState().ctx.zones.private.zoneCards[deckKey]!.length).toBe(4);
  });

  it("does not draw when the paired pilot lacks the White Base Team trait", () => {
    // Pilot lacks the "white base team" trait — the whenPaired
    // qualification filter rejects the trigger, so the draw must be
    // skipped. Rules 3-2-5 / 10-2-1.
    const nonWbPilot = createMockPilot({ traits: ["zeon"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [nonWbPilot],
      play: [st01GundamMaForm002],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;
    const deckKey = `deck:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;

    expectSuccess(p1.assignPilot(nonWbPilot, st01GundamMaForm002));

    // Pilot leaves hand (-1). No draw → hand is handBefore - 1.
    expect(p1.getHand().length).toBe(handBefore - 1);
    // Deck is unchanged — the qualification blocked the trigger.
    expect(engine.getState().ctx.zones.private.zoneCards[deckKey]!.length).toBe(deckBefore);
  });
});
