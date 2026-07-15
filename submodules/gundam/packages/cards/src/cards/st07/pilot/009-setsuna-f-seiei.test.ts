import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07SetsunaFSeiei009 } from "./009-setsuna-f-seiei.ts";

describe("Setsuna F. Seiei (ST07-009)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07SetsunaFSeiei009] },
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

    expect(p2.getHand()).toContain(shieldId);
  });

  it("【Attack】gives only this Unit AP+1 during this turn with fewer than 7 CB cards in trash", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 5 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));

    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(6);
    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
  });

  it("【Attack】gives all friendly CB Units AP+1 instead with 7 or more CB cards in trash", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 5 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const trash = Array.from({ length: 7 }, () => createMockUnit({ traits: ["cb"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        resourceArea: activeResources(4),
        trash,
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));

    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(6);
    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);
  });
});
