import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04Tokwan088 } from "./088-tokwan.ts";

describe("Tokwan (GD04-088)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04Tokwan088] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("when blocked by an enemy Lv.4 or lower Unit, this Unit cannot receive battle damage this battle", () => {
    const host = createMockUnit({ ap: 1, hp: 6, level: 4, cost: 1 });
    const defender = createMockUnit({ ap: 1, hp: 6, level: 2, cost: 1 });
    const blocker = createMockUnit({
      ap: 3,
      hp: 6,
      level: 4,
      cost: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [gd04Tokwan088], resourceArea: activeResources(4) },
      { play: [{ card: defender, exhausted: true }, blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.assignPilot(gd04Tokwan088, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p2.getDamage(blockerId)).toBe(3);
  });

  it("does not prevent battle damage when the blocking Unit is Lv.5 or higher", () => {
    const host = createMockUnit({ ap: 1, hp: 6, level: 4, cost: 1 });
    const defender = createMockUnit({ ap: 1, hp: 6, level: 2, cost: 1 });
    const blocker = createMockUnit({
      ap: 3,
      hp: 6,
      level: 5,
      cost: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [gd04Tokwan088], resourceArea: activeResources(4) },
      { play: [{ card: defender, exhausted: true }, blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.assignPilot(gd04Tokwan088, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(hostId)).toBe(3);
    expect(p2.getDamage(blockerId)).toBe(3);
  });
});
