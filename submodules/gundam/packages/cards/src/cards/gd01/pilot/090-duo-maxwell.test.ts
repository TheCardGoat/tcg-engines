import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01IronFistedDiscipline119 } from "../command/119-iron-fisted-discipline.ts";
import { gd01DuoMaxwell090 } from "./090-duo-maxwell.ts";

function passToPlayerTwoMain(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  p2: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
}

describe("Duo Maxwell (GD01-090)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01DuoMaxwell090] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01DuoMaxwell090)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("prevents an enemy effect from reducing the linked Unit's AP", () => {
    const host = createMockUnit({ ap: 5, hp: 5, level: 4, linkCondition: "[Duo Maxwell]" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuoMaxwell090],
        play: [host],
        resourceArea: activeResources(5),
        deck: 5,
      },
      {
        hand: [gd01IronFistedDiscipline119],
        resourceArea: activeResources(3),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01DuoMaxwell090, hostId));
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(gd01IronFistedDiscipline119));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Iron-Fisted Discipline to ask which enemy Unit loses AP");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(6);
  });

  it("allows the enemy effect to reduce AP when Duo is paired but not linked", () => {
    const host = createMockUnit({ ap: 5, hp: 5, level: 4, linkCondition: "[Heero Yuy]" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuoMaxwell090],
        play: [host],
        resourceArea: activeResources(5),
        deck: 5,
      },
      {
        hand: [gd01IronFistedDiscipline119],
        resourceArea: activeResources(3),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01DuoMaxwell090, hostId));
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(gd01IronFistedDiscipline119));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Iron-Fisted Discipline to ask which enemy Unit loses AP");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
  });
});
