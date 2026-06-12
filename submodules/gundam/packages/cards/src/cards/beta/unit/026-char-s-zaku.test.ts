import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaCharSZaku026 } from "./026-char-s-zaku.ts";

describe("Char's Zaku Ⅱ (GD01-026)", () => {
  it("【During Pair】【Destroyed】 deploys a rested token when Char's Zaku is paired", () => {
    // Destroyed trigger with a `duringPair` condition and a `deployToken`
    // directive. It enqueues on `unitDestroyed` when the gate holds.
    const engine = GundamTestEngine.create({ play: [betaCharSZaku026] }, {});
    const [charZakuId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!charZakuId) throw new Error("fixture failed");

    // Pair a pilot so the `duringPair` gate holds at destroy time.
    // biome-ignore lint/suspicious/noExplicitAny: internal pair helper
    (engine.getG() as any).pilotAssignments[charZakuId] = `pilot-for-${charZakuId}`;

    const baBefore = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;

    engine.destroyUnit(charZakuId);

    // Char's Zaku left battleArea (→ trash) but a token landed → net zero.
    const baAfter = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;
    expect(baAfter).toBe(baBefore);
    // Trash holds the destroyed Zaku (+ any pilot cleanup side effects).
    const trash = engine.asPlayer(PLAYER_ONE).getCardsInZone("trash");
    expect(trash.length).toBeGreaterThanOrEqual(1);
  });

  it("【During Pair】【Destroyed】 does NOT deploy a token when Char's Zaku is not paired", () => {
    // Unpaired → `duringPair` gate fails → effect is not enqueued →
    // destruction sends the unit to trash without a replacement token.
    const engine = GundamTestEngine.create({ play: [betaCharSZaku026] }, {});
    const [charZakuId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!charZakuId) throw new Error("fixture failed");

    const baBefore = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;

    engine.destroyUnit(charZakuId);

    const baAfter = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;
    expect(baAfter).toBe(baBefore - 1);
  });
});
