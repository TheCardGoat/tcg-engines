import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04HallelujahHaptism090 } from "./090-hallelujah-haptism.ts";

describe("Hallelujah Haptism (GD04-090)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04HallelujahHaptism090] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top card of your deck. If it is a (CB) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.", () => {
    it("adds the top card to hand when it is a CB card", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));

      engine.resolveCombat({ attackerId: hostId, target: defenderId });

      const framework = engine.getRuntime().getFrameworkReadAPI();
      const cbInHand = p1
        .getHand()
        .some((id) => framework.cards.getDefinition(id)?.name === "CB Reward");
      expect(cbInHand).toBe(true);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    });

    it("returns the top card to the deck when it is not a CB card", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const nonCbCard = createMockUnit({ name: "Non-CB Card", traits: ["zaft"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [nonCbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));

      engine.resolveCombat({ attackerId: hostId, target: defenderId });

      expect(p1.getHand()).toHaveLength(0);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
    });

    it("does not look at the deck when the paired Unit is not linked", () => {
      const host = createMockUnit({
        name: "Wrong Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Different Pilot]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));

      engine.resolveCombat({ attackerId: hostId, target: defenderId });

      expect(p1.getHand()).toHaveLength(0);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
    });
  });
});
