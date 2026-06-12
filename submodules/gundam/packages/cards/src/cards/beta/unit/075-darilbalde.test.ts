import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  expectCardInHand,
} from "@tcg/gundam-engine";
import { betaDarilbalde075 } from "./075-darilbalde.ts";

describe("Darilbalde (GD01-075)", () => {
  it("【Deploy】 returns a chosen 1-HP enemy Unit to its owner's hand", () => {
    const fragile = createMockUnit({ ap: 2, hp: 1 });
    const engine = GundamTestEngine.create(
      { hand: [betaDarilbalde075], resourceArea: activeResources(3) },
      { play: [fragile] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [fragileId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaDarilbalde075, { targets: [fragileId!] }));

    expectCardInHand(engine, fragileId!, p2.playerId);
  });
});
