import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04Tokwan088 } from "./088-tokwan.ts";

describe("Tokwan (GD04-088)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04Tokwan088] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
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
