import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Reformationist114 } from "../../gd04/command/114-reformationist.ts";
import { gd03Hotarubi129 } from "./129-hotarubi.ts";

describe("Hotarubi (GD03-129)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Hotarubi129] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Hotarubi129)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds one shield to its owner's hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Hotarubi129],
      resourceArea: activeResources(4),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Hotarubi129));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Hotarubi129)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("may rest itself to mill one after a friendly Tekkadan Unit receives effect damage", () => {
    const unit = createMockUnit({ traits: ["tekkadan"], hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Reformationist114],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(2),
        deck: 3,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.playCommand(gd04Reformationist114, { targets: [unitId, enemyId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      sourceCardId: baseId,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.getDamage(unitId)).toBe(1);
    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
  });

  it("does not rest or mill when the player declines", () => {
    const unit = createMockUnit({ traits: ["teiwaz"], hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Reformationist114],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(2),
        deck: 3,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.playCommand(gd04Reformationist114, { targets: [unitId, enemyId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
  });

  it("does not trigger for a friendly Unit outside Tekkadan and Teiwaz", () => {
    const unit = createMockUnit({ traits: ["earth federation"], hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Reformationist114],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(2),
        deck: 3,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.playCommand(gd04Reformationist114, { targets: [unitId, enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
  });

  it("does not trigger when the effect damage is received during the opponent's turn", () => {
    const unit = createMockUnit({ traits: ["tekkadan"], hp: 5 });
    const opponentUnit = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd03Hotarubi129], play: [unit], deck: 3 },
      {
        hand: [gd04Reformationist114],
        play: [opponentUnit],
        resourceArea: activeResources(2),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const opponentUnitId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p2.playCommand(gd04Reformationist114, { targets: [opponentUnitId, unitId] }));

    expect(p1.getDamage(unitId)).toBe(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
  });
});
