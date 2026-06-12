import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd03ChristinaMackenzie085 } from "./085-christina-mackenzie.ts";

describe("Christina Mackenzie (GD03-085)", () => {
  it("has the printed pilot identity", () => {
    expect(gd03ChristinaMackenzie085.type).toBe("pilot");
    expect(gd03ChristinaMackenzie085.cardNumber).toBe("GD03-085");
  });

  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03ChristinaMackenzie085] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });
});
