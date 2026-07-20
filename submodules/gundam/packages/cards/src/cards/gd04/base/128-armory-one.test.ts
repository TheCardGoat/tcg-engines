import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ArmoryOne128 } from "./128-armory-one.ts";

describe("Armory One (GD04-128)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04ArmoryOne128],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04ArmoryOne128));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04ArmoryOne128] },
    );
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
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd04ArmoryOne128)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04ArmoryOne128] },
    );
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
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(gd04ArmoryOne128)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Destroyed】 makes both players draw 1 after battle destroys this Base", () => {
    const attacker = createMockUnit({ name: "Base Breaker", ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd04ArmoryOne128], deck: 2 },
      { play: [attacker], deck: 2 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    const p1HandBefore = p1.getCardsInZone("hand").length;
    const p2HandBefore = p2.getCardsInZone("hand").length;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(baseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("hand")).toHaveLength(p1HandBefore + 1);
    expect(p2.getCardsInZone("hand")).toHaveLength(p2HandBefore + 1);
  });

  it("【Destroyed】 ends the game before the other player draws when its owner decks out", () => {
    const attacker = createMockUnit({ name: "Base Breaker", ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd04ArmoryOne128], deck: 1 },
      { play: [attacker], deck: 2 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const p1HandBefore = p1.getHand().length;
    const p2HandBefore = p2.getHand().length;
    const p2DeckBefore = p2.getCardsInZone("deck").length;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(baseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
    expect(p1.getCardsInZone("deck")).toHaveLength(0);
    expect(p1.getHand()).toHaveLength(p1HandBefore + 1);
    expect(p2.getCardsInZone("deck")).toHaveLength(p2DeckBefore);
    expect(p2.getHand()).toHaveLength(p2HandBefore);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
