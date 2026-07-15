import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07Ptolemaios015 } from "./015-ptolemaios.ts";

describe("Ptolemaios (ST07-015)", () => {
  it("【Deploy】Add 1 of your Shields to your hand.", () => {
    const engine = GundamTestEngine.create({
      hand: [st07Ptolemaios015],
      resourceArea: activeResources(2),
      shieldArea: [createMockUnit({ name: "Shield" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.deployBase(st07Ptolemaios015));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】Deploy this card.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07Ptolemaios015] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardsInZone("baseSection")).toContain(shieldId);
  });

  it("while a rested friendly CB Unit is in play, prevents Base battle damage from enemy Lv.3 or lower non-token Units", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const attacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [{ card: cbUnit, exhausted: true }], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(baseId)).toBe(0);
  });

  it("does not prevent Base battle damage without a rested friendly CB Unit", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const attacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [cbUnit], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(baseId)).toBe(3);
  });

  it("does not prevent Base battle damage from an enemy Unit token", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const tokenAttacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [{ card: cbUnit, exhausted: true }], deck: 5 },
      { play: [{ card: tokenAttacker, isToken: true }], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(baseId)).toBe(3);
  });
});
