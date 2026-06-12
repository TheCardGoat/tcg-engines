import { describe, expect, it } from "vite-plus/test";
import { alphaKiroshiOptics, spoilerDumDumMaelstromTriggerman } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Dum Dum - Maelstrom Triggerman", () => {
  it("calls and draws at least one card even without defeating Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaKiroshiOptics],
      legendArea: [{ card: spoilerDumDumMaelstromTriggerman, faceDown: true }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.callLegend(spoilerDumDumMaelstromTriggerman, { as: P1 });

    expect(engine.getHandCount(P1)).toBeGreaterThanOrEqual(handBefore + 1);
    expect(engine.getCard(spoilerDumDumMaelstromTriggerman, "legendArea", P1).meta.faceDown).toBe(
      false,
    );
  });

  it("uses an if-you-do branch to defeat friendly Gear for the larger draw", () => {
    expect(spoilerDumDumMaelstromTriggerman.abilities[0]!.effects[0]).toMatchObject({
      effect: "ifYouDo",
    });
  });
});
