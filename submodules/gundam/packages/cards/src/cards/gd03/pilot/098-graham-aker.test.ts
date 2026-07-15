import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ImmortalColasour120 } from "../command/120-immortal-colasour.ts";
import { gd03GrahamAker098 } from "./098-graham-aker.ts";

describe("Graham Aker (GD03-098)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03GrahamAker098] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03GrahamAker098)).toBe(`hand:${PLAYER_TWO}`);
  });

  function readyPairedHost({ linkCondition = "[Graham Aker]", enemyHp = 3 } = {}) {
    const host = createMockUnit({
      name: "Graham Host",
      traits: ["un"],
      hp: 6,
      linkCondition,
    });
    const battleDestroyer = createMockUnit({ name: "UN Attacker", traits: ["un"], ap: 4, hp: 6 });
    const fragileDefender = createMockUnit({ name: "Fragile Defender", ap: 0, hp: 1 });
    const returnTarget = createMockUnit({ name: "Return Target", hp: enemyHp });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GrahamAker098, gd03ImmortalColasour120],
        play: [{ card: host, exhausted: true }, battleDestroyer],
        resourceArea: activeResources(4),
      },
      { play: [{ card: fragileDefender, exhausted: true }, returnTarget] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, attackerId] = p1.getCardsInZone("battleArea");
    const [defenderId, returnTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03GrahamAker098, hostId!));
    expectSuccess(p1.playCommand(gd03ImmortalColasour120));
    expectSuccess(p1.enterBattle(attackerId!, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([hostId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [hostId!] }));

    return { p1, p2, hostId: hostId!, returnTargetId: returnTargetId! };
  }

  it("returns an enemy Unit with 3 HP when the linked rested Unit is readied by an effect", () => {
    const { p1, p2, hostId, returnTargetId } = readyPairedHost();

    expect(p1.isExhausted(hostId)).toBe(false);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [returnTargetId],
    });
    expectSuccess(p1.resolveEffect({ targets: [returnTargetId] }));

    expect(p2.getCardZone(returnTargetId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("does not trigger when the paired Unit is not linked", () => {
    const { p1, p2, returnTargetId } = readyPairedHost({ linkCondition: "[Different Pilot]" });

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
  });

  it("does not offer an enemy Unit with more than 3 HP", () => {
    const { p1, p2, returnTargetId } = readyPairedHost({ enemyHp: 4 });

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
  });
});
