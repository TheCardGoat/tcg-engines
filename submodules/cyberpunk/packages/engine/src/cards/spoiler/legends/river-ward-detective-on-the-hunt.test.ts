import { describe, expect, it } from "vite-plus/test";
import { alphaKiroshiOptics, spoilerRiverWardDetectiveOnTheHunt } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("River Ward - Detective on the Hunt", () => {
  it("calls to draw a card", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaKiroshiOptics],
      legendArea: [{ card: spoilerRiverWardDetectiveOnTheHunt, faceDown: true }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.callLegend(spoilerRiverWardDetectiveOnTheHunt, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends on any unit attack to attach a low-cost Gear from hand", () => {
    const ability = spoilerRiverWardDetectiveOnTheHunt.abilities[1]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "cardAttacks" } });
    expect(ability.effects[0]).toMatchObject({ effect: "attachCard", free: true });
  });
});
