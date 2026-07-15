import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03WarpedIntent112 } from "./112-warped-intent.ts";

describe("Warped Intent (GD03-112)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03WarpedIntent112] },
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
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03WarpedIntent112)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("gives every paired Unit AP+2 this turn and leaves unpaired Units unchanged", () => {
    const friendlyPilot = createMockPilot({ cost: 1, apBonus: 0, hpBonus: 0 });
    const enemyPilot = createMockPilot({ cost: 1, apBonus: 0, hpBonus: 0 });
    const pairedUnit = createMockUnit({ ap: 2, hp: 4 });
    const unpairedUnit = createMockUnit({ ap: 2, hp: 4 });
    const enemyUnit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03WarpedIntent112, friendlyPilot],
        play: [pairedUnit, unpairedUnit],
        resourceArea: activeResources(5),
        deck: 5,
      },
      {
        hand: [enemyPilot],
        play: [enemyUnit],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [pairedId, unpairedId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.assignPilot(enemyPilot, enemyId));
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(friendlyPilot, pairedId!));
    expectSuccess(p1.playCommand(gd03WarpedIntent112));

    expect(p1.getVisibleCard(pairedId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(unpairedId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(pairedId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });

  it("can grant AP+2 after players legally enter the Action Step", () => {
    const pilot = createMockPilot({ cost: 1, apBonus: 0, hpBonus: 0 });
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03WarpedIntent112, pilot],
        play: [unit],
        resourceArea: activeResources(5),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd03WarpedIntent112));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
  });
});
