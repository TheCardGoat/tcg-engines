import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02ComradesComeFirst116 } from "./116-comrades-come-first.ts";

function trashCards(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createMockCommand({ name: `Trash Card ${index + 1}` }),
  );
}

describe("Comrades Come First (GD02-116)", () => {
  it("lets the chosen Vulture Unit attack an active enemy Unit at Lv.4 or lower", () => {
    const vulture = createMockUnit({ ap: 3, hp: 5, traits: ["vulture"] });
    const other = createMockUnit({ traits: ["aeug"] });
    const eligibleEnemy = createMockUnit({ level: 4, hp: 6 });
    const tooHigh = createMockUnit({ level: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ComradesComeFirst116],
        play: [vulture, other],
        trash: trashCards(7),
        resourceArea: activeResources(3),
      },
      { play: [eligibleEnemy, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [vultureId, otherId] = p1.getCardsInZone("battleArea");
    const [eligibleEnemyId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd02ComradesComeFirst116));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly Vulture Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([vultureId]);
    expect(choice.legalTargetIds).not.toContain(otherId);
    expectSuccess(p1.resolveEffect({ targets: [vultureId!] }));

    expect(p1.getLegalAttackTargets(vultureId!)).toContain(eligibleEnemyId);
    expect(p1.getLegalAttackTargets(vultureId!)).not.toContain(tooHighId);
    expectSuccess(p1.enterBattle(vultureId!, eligibleEnemyId!));
    expect(p1.getCardZone(gd02ComradesComeFirst116)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played with only six cards in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ComradesComeFirst116],
      play: [createMockUnit({ traits: ["vulture"] })],
      trash: trashCards(6),
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd02ComradesComeFirst116),
      "PRECONDITION_FAILED",
    );
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ComradesComeFirst116],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02ComradesComeFirst116), "WRONG_TIMING");
  });

  it("can be paired as Roybea Loy instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02ComradesComeFirst116],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("enforces its printed Lv.3 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ComradesComeFirst116],
      resourceArea: activeResources(2),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02ComradesComeFirst116),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02ComradesComeFirst116)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02ComradesComeFirst116],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02ComradesComeFirst116), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ComradesComeFirst116)).toBe(`hand:${PLAYER_ONE}`);
  });
});
