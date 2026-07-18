import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02SisterlyCare113 } from "./113-sisterly-care.ts";

function linkedTeiwazFixture() {
  const linkUnit = createMockUnit({ traits: ["teiwaz"], linkCondition: "[Link Pilot]" });
  const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
  const eligibleEnemy = createMockUnit({ ap: 2, hp: 6 });
  const tooStrong = createMockUnit({ ap: 3, hp: 6 });
  const engine = GundamTestEngine.create(
    {
      hand: [linkPilot, gd02SisterlyCare113],
      play: [linkUnit],
      resourceArea: activeResources(6),
    },
    { play: [eligibleEnemy, tooStrong] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
  const [eligibleEnemyId, tooStrongId] = p2.getCardsInZone("battleArea");
  expectSuccess(p1.assignPilot(linkPilot, linkUnitId));
  return { engine, p1, p2, eligibleEnemyId: eligibleEnemyId!, tooStrongId: tooStrongId! };
}

describe("Sisterly Care (GD02-113)", () => {
  it("【Main】 destroys the chosen 2-AP enemy with a friendly Teiwaz Link Unit in play", () => {
    const { p1, p2, eligibleEnemyId, tooStrongId } = linkedTeiwazFixture();
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible eligible enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([eligibleEnemyId]);
    expect(choice.legalTargetIds).not.toContain(tooStrongId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId] }));

    expect(p2.getCardZone(eligibleEnemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(tooStrongId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can destroy an eligible enemy during a legally reached Action step", () => {
    const { p1, p2, eligibleEnemyId } = linkedTeiwazFixture();

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02SisterlyCare113));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected an enemy Unit choice");
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId] }));

    expect(p2.getCardZone(eligibleEnemyId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("cannot be played without a friendly Teiwaz Link Unit", () => {
    const enemy = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd02SisterlyCare113], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02SisterlyCare113), "PRECONDITION_FAILED");
  });

  it("can be paired as Amida Arca instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02SisterlyCare113],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
  });

  it("enforces its printed Lv.4 and active Resource cost 2", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02SisterlyCare113],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02SisterlyCare113),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02SisterlyCare113)).toBe(
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
      hand: [setup, gd02SisterlyCare113],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02SisterlyCare113), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02SisterlyCare113)).toBe(`hand:${PLAYER_ONE}`);
  });
});
