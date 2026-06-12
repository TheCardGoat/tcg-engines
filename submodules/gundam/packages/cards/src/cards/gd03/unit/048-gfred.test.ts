import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Gfred048 } from "./048-gfred.ts";

describe("GFreD (GD03-048)", () => {
  it("【Burst】 deploys a rested GFreD token when there are 3 or less enemy Shields", () => {
    const engine = GundamTestEngine.create({ deck: [gd03Gfred048] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    const tokenId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("GFreD");
    expect(engine.getG().exhausted[tokenId]).toBe(true);
  });

  it("does not deploy the Burst token while the enemy has 4 Shields", () => {
    const engine = GundamTestEngine.create(
      { deck: [gd03Gfred048] },
      { deck: Array(4).fill(createMockUnit()) },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    seedShieldsFromDeck(engine, PLAYER_TWO, 4);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")).toHaveLength(0);
  });
});
