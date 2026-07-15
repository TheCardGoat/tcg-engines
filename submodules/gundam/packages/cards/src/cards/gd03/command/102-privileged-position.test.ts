import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03PrivilegedPosition102 } from "./102-privileged-position.ts";

describe("Privileged Position (GD03-102)", () => {
  it("【Burst】 draws 1 card through a revealed Shield interaction", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03PrivilegedPosition102], deck: 2 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p2.getCardsInZone("deck").length;
    const handBefore = p2.getHand().length;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
    expect(p2.getHand()).toHaveLength(handBefore + 1);
    expect(p2.getCardZone(gd03PrivilegedPosition102)).toBe(`trash:${PLAYER_TWO}`);
  });

  function reachActionWithHost({
    traits,
    linkCondition,
  }: {
    traits: string[];
    linkCondition: string;
  }) {
    const pilot = createMockPilot({ name: "Titans Pilot", cost: 1 });
    const host = createMockUnit({
      name: "Battling Host",
      traits,
      ap: 3,
      hp: 5,
      linkCondition,
    });
    const enemy = createMockUnit({ ap: 0, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd03PrivilegedPosition102],
        play: [host],
        resourceArea: activeResources(6),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());

    return { p1, hostId };
  }

  it("【Action】 sets a battling Titans Link Unit as active", () => {
    const { p1, hostId } = reachActionWithHost({
      traits: ["titans"],
      linkCondition: "[Titans Pilot]",
    });
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [hostId] }));

    expect(p1.isExhausted(hostId)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not set a battling non-Titans Link Unit as active", () => {
    const { p1, hostId } = reachActionWithHost({
      traits: ["zeon"],
      linkCondition: "[Titans Pilot]",
    });
    const commandId = p1.getHand()[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [hostId] }), "INVALID_TARGET");

    expect(p1.isExhausted(hostId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not set a battling Titans Unit as active when its Pilot does not Link", () => {
    const { p1, hostId } = reachActionWithHost({
      traits: ["titans"],
      linkCondition: "[Different Pilot]",
    });
    const commandId = p1.getHand()[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [hostId] }), "INVALID_TARGET");

    expect(p1.isExhausted(hostId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not set a Titans Link Unit as active when a different Unit is battling", () => {
    const pilot = createMockPilot({ name: "Titans Pilot", cost: 1 });
    const host = createMockUnit({
      traits: ["titans"],
      linkCondition: "[Titans Pilot]",
    });
    const enemyAttacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd03PrivilegedPosition102],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(6),
        deck: 3,
      },
      { play: [enemyAttacker], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    const commandId = p1.getHand()[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [hostId] }), "INVALID_TARGET");

    expect(p1.isExhausted(hostId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
