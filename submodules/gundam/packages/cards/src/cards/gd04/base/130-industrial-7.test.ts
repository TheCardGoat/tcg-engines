import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  getEffectiveStats,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Industrial7130 } from "./130-industrial-7.ts";

describe("Industrial 7 (GD04-130)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Industrial7130],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Industrial7130));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04Industrial7130] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04Industrial7130);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  describe("【Activate･Main】【Once per Turn】Exile 1 Command card from your trash：Choose 1 enemy Unit. It gets AP-1 during this turn.", () => {
    it("exiles a Command from trash and gives an enemy Unit AP-1 this turn", () => {
      const command = createMockCommand();
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Industrial7130], trash: [command] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const commandId = p1.getCardsInZone("trash")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(baseId, { targets: [enemyId] }));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(p1.getCardsInZone("trash")).not.toContain(commandId);
      expect(engine.getState().ctx.zones.private.cardIndex[commandId]?.zoneKey).toBe("removalArea");
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(3);
    });

    it("cannot activate without a Command card in trash to exile", () => {
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Industrial7130] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Industrial7130, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects friendly Unit targets", () => {
      const command = createMockCommand();
      const friendly = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create({
        baseSection: [gd04Industrial7130],
        play: [friendly],
        trash: [command],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Industrial7130, { targets: [friendlyId] }),
        "ILLEGAL_TARGET",
      );
    });
  });
});
