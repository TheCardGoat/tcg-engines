import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  expectCardInHand,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaTheWitchAndTheBride117 } from "./117-the-witch-and-the-bride.ts";
describe("The Witch and the Bride (GD01-117, beta reprint)", () => {
  it("【Burst】Activate this card's 【Main】 — returns an HP ≤ 5 enemy Unit to hand.", () => {
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { deck: [betaTheWitchAndTheBride117] },
      { play: [enemy] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        betaTheWitchAndTheBride117.cardNumber,
        asPlayerId(PLAYER_ONE),
      );

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expectCardInHand(engine, enemyId!, p2.playerId);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.", () => {
    it("bounces an HP ≤ 5 enemy unit back to its owner's hand", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaTheWitchAndTheBride117],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaTheWitchAndTheBride117, { targets: [enemyId!] }));

      expectCardInHand(engine, enemyId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with more than 5 HP", () => {
      const tough = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaTheWitchAndTheBride117],
          resourceArea: activeResources(5),
        },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(betaTheWitchAndTheBride117, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
