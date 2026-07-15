import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03YazanGable086 } from "./086-yazan-gable.ts";

describe("Yazan Gable (GD03-086)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03YazanGable086] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03YazanGable086)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Attack】 gives AP+1 to a Titans Unit whose Lv. is no higher than the paired Unit", () => {
    const host = createMockUnit({ level: 5, ap: 3, hp: 5 });
    const target = createMockUnit({ level: 5, ap: 2, hp: 4, traits: ["titans"] });
    const defender = createMockUnit({ ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03YazanGable086],
        play: [host, target],
        resourceArea: activeResources(5),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, targetId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03YazanGable086, hostId!));
    expectSuccess(p1.enterBattle(hostId!, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [targetId],
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p1.getVisibleCard(targetId!)?.effectiveAp).toBe(3);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(targetId!)?.effectiveAp).toBe(2);
  });

  it("does not offer a Unit that is above the paired Unit's Lv. or is not Titans", () => {
    const host = createMockUnit({ level: 4, ap: 3, hp: 5 });
    const highLevelTarget = createMockUnit({ level: 5, ap: 2, hp: 4, traits: ["titans"] });
    const wrongTraitTarget = createMockUnit({ level: 4, ap: 2, hp: 4, traits: ["zeon"] });
    const defender = createMockUnit({ ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03YazanGable086],
        play: [host, highLevelTarget, wrongTraitTarget],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, highLevelTargetId, wrongTraitTargetId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03YazanGable086, hostId!));
    expectSuccess(p1.enterBattle(hostId!, defenderId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(highLevelTargetId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(wrongTraitTargetId!)?.effectiveAp).toBe(2);
  });
});
