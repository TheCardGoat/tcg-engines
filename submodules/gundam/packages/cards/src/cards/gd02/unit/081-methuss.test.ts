import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Methuss081 } from "./081-methuss.ts";
import { gd02AspiringPilot120 } from "../command/120-aspiring-pilot.ts";
import { gd02KamilleBidan097 } from "../pilot/097-kamille-bidan.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Methuss (GD02-081)", () => {
  it("requires its printed Lv.2 and two active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02Methuss081],
      resourceArea: activeResources(1),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02Methuss081), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02Methuss081)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02Methuss081],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02Methuss081), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02Methuss081)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Fa Yuiry]", () => {
    it("becomes a Link Unit when paired with Fa Yuiry", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02AspiringPilot120, linkCheck],
        play: [gd02Methuss081],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.playCommandAsPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02KamilleBidan097, linkCheck],
        play: [gd02Methuss081],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      expectFailure(p1.playCommand(commandId!), "NO_LEGAL_TARGETS");

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  it("【Deploy】If a friendly white Base is in play, AP-2 this turn to chosen enemy Unit", () => {
    const whiteBase = createMockBase({ color: "white", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Methuss081],
        baseSection: [whiteBase],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02Methuss081));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

    expect(p2.getVisibleCard(enemyId!)?.effectiveAp).toBe(2);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expect(p2.getVisibleCard(enemyId!)?.effectiveAp).toBe(4);
  });

  it("【Deploy】A friendly non-white Base does not satisfy the condition or publish a prompt", () => {
    const blueBase = createMockBase({ color: "blue", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Methuss081],
        baseSection: [blueBase],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02Methuss081));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId!)?.effectiveAp).toBe(4);
  });

  it("【Deploy】A friendly white Base with no enemy Unit produces no prompt", () => {
    const whiteBase = createMockBase({ color: "white", hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd02Methuss081],
      baseSection: [whiteBase],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(sourceId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(sourceId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
