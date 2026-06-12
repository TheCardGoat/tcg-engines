import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01CharSZaku026 } from "./026-char-s-zaku.ts";

describe("Char's Zaku Ⅱ (GD01-026)", () => {
  it("【During Pair】【Destroyed】 deploys a replacement token when paired", () => {
    const engine = GundamTestEngine.create({ play: [gd01CharSZaku026] }, {});
    const [charZakuId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!charZakuId) throw new Error("fixture failed");

    // biome-ignore lint/suspicious/noExplicitAny: internal pair helper
    (engine.getG() as any).pilotAssignments[charZakuId] = `pilot-for-${charZakuId}`;

    const baBefore = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;
    engine.destroyUnit(charZakuId);
    // Unit left → token replaced → net zero change in battleArea.
    const baAfter = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea").length;
    expect(baAfter).toBe(baBefore);
  });
});
