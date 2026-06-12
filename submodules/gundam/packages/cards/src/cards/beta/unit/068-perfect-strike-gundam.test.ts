import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectAttackRedirectedTo,
  expectSuccess,
  activeResources,
  createMockUnit,
  expectCardInHand,
} from "@tcg/gundam-engine";
import { betaPerfectStrikeGundam068 } from "./068-perfect-strike-gundam.ts";

describe("Perfect Strike Gundam (GD01-068)", () => {
  it("<Blocker> can intercept an attack aimed at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, betaPerfectStrikeGundam068] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectAttackRedirectedTo(engine, blockerId);
  });

  it("【Deploy】 returns a chosen 1-HP enemy Unit to its owner's hand", () => {
    const fragile = createMockUnit({ ap: 2, hp: 1 });
    const engine = GundamTestEngine.create(
      { hand: [betaPerfectStrikeGundam068], resourceArea: activeResources(5) },
      { play: [fragile] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [fragileId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaPerfectStrikeGundam068, { targets: [fragileId!] }));

    expectCardInHand(engine, fragileId!, p2.playerId);
  });
});
