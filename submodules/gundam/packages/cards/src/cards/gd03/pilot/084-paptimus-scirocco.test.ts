import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03PaptimusScirocco084 } from "./084-paptimus-scirocco.ts";

describe("Paptimus Scirocco (GD03-084)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03PaptimusScirocco084] },
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
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03PaptimusScirocco084)).toBe(`hand:${PLAYER_TWO}`);
  });

  function setup({ jupitrisFirst }: { jupitrisFirst: boolean }) {
    const host = createMockUnit({ linkCondition: "[Paptimus Scirocco]" });
    const jupitris = createMockUnit({
      name: "Jupitris Unit",
      traits: ["jupitris"],
      hp: 4,
    });
    const nonJupitris = createMockUnit({ name: "Titans Unit", traits: ["titans"], hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd03PaptimusScirocco084],
      play: jupitrisFirst
        ? [host, { card: jupitris, damage: 2 }, { card: nonJupitris, damage: 2 }]
        : [host, { card: nonJupitris, damage: 2 }, { card: jupitris, damage: 2 }],
      deck: 2,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, firstOtherId, secondOtherId] = p1.getCardsInZone("battleArea");

    return {
      p1,
      p2,
      hostId: hostId!,
      firstOtherId: firstOtherId!,
      secondOtherId: secondOtherId!,
    };
  }

  it("grants Repair 2 to the chosen other Jupitris Unit and draws 1", () => {
    const { p1, p2, hostId, firstOtherId, secondOtherId } = setup({ jupitrisFirst: true });

    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstOtherId, secondOtherId]),
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
    expect(choice.legalTargetIds).not.toContain(hostId);
    expectSuccess(p1.resolveEffect({ targets: [firstOtherId] }));

    expect(p1.getVisibleCard(firstOtherId)?.keywords).toContain("Repair");
    expect(p1.getVisibleCard(secondOtherId)?.keywords).not.toContain("Repair");
    expect(p1.getHand()).toHaveLength(1);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(firstOtherId)).toBe(0);
    expect(p1.getVisibleCard(firstOtherId)?.keywords).not.toContain("Repair");
  });

  it("grants Repair 2 without drawing when the chosen Unit is not Jupitris", () => {
    const { p1, hostId, firstOtherId } = setup({ jupitrisFirst: false });

    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, hostId));
    expectSuccess(p1.resolveEffect({ targets: [firstOtherId] }));

    expect(p1.getVisibleCard(firstOtherId)?.keywords).toContain("Repair");
    expect(p1.getHand()).toHaveLength(0);
  });

  it("does not offer a Unit when Scirocco is paired but not linked", () => {
    const host = createMockUnit({ linkCondition: "[Kamille Bidan]" });
    const other = createMockUnit({ traits: ["jupitris"], hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd03PaptimusScirocco084],
      play: [host, { card: other, damage: 2 }],
      deck: 2,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, otherId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, hostId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(otherId!)?.keywords).not.toContain("Repair");
    expect(p1.getHand()).toHaveLength(0);
  });
});
