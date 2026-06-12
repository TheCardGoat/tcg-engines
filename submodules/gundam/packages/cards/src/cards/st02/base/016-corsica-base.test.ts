import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedBaseAsShield } from "@tcg/gundam-engine";
import { st02CorsicaBase016 } from "./016-corsica-base.ts";

describe("Corsica Base (ST02-016)", () => {
  it("【Burst】 Deploy this card — flips Corsica Base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st02CorsicaBase016] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st02CorsicaBase016);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });
});
