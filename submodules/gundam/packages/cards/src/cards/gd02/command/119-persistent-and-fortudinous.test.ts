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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02PersistentAndFortudinous119 } from "./119-persistent-and-fortudinous.ts";

function reachGjallarhornLinkBattle() {
  const linkUnit = createMockUnit({
    name: "Gjallarhorn Link",
    ap: 3,
    hp: 6,
    traits: ["gjallarhorn"],
    linkCondition: "[Link Pilot]",
  });
  const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
  const enemy = createMockUnit({ name: "Enemy", ap: 4, hp: 6 });
  const engine = GundamTestEngine.create(
    {
      hand: [linkPilot, gd02PersistentAndFortudinous119],
      play: [linkUnit],
      shieldArea: [createMockUnit({ name: "Opening Shield" })],
      resourceArea: activeResources(4),
      deck: 3,
    },
    { play: [enemy], deck: 3 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
  const enemyId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(enemyId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.assignPilot(linkPilot, linkUnitId));
  expectSuccess(p1.enterBattle(linkUnitId, enemyId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());

  return { p1, p2, linkUnitId, enemyId };
}

describe("Persistent and Fortudinous (GD02-119)", () => {
  it("gives the chosen enemy AP-3 during a battle with a Gjallarhorn Link Unit", () => {
    const { p1, p2, linkUnitId, enemyId } = reachGjallarhornLinkBattle();

    expectSuccess(p1.playCommand(gd02PersistentAndFortudinous119));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit AP-reduction choice");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(1);
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(linkUnitId)).toBe(1);
    expect(p1.getCardZone(gd02PersistentAndFortudinous119)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be activated without a friendly Gjallarhorn Link Unit", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02PersistentAndFortudinous119], resourceArea: activeResources(2) },
      { play: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02PersistentAndFortudinous119), "PRECONDITION_FAILED");
  });

  it("can be paired as Carta Issue instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02PersistentAndFortudinous119],
      play: [host],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("cannot activate during Main", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02PersistentAndFortudinous119],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd02PersistentAndFortudinous119),
      "WRONG_TIMING",
    );
  });

  it("enforces its printed Lv.2 and active Resource cost 1 in a legal Action step", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02PersistentAndFortudinous119],
      resourceArea: activeResources(1),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    expectSuccess(lowP1.passPhase());
    expectSuccess(lowLevel.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(
      lowP1.playCommand(gd02PersistentAndFortudinous119),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02PersistentAndFortudinous119)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02PersistentAndFortudinous119],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectSuccess(p1.passPhase());
    expectSuccess(insufficient.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(p1.playCommand(gd02PersistentAndFortudinous119), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02PersistentAndFortudinous119)).toBe(`hand:${PLAYER_ONE}`);
  });
});
