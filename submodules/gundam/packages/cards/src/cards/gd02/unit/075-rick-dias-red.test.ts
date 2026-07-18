import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02RickDiasRed075 } from "./075-rick-dias-red.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02KamilleBidan097 } from "../pilot/097-kamille-bidan.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

function restFriendlyBaseCommand() {
  return createMockCommand({
    name: "Rest Friendly Base",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner: "friendly", cardType: "base", state: "active", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 active friendly Base. Rest it.",
      },
    ],
  });
}

function attackFixture(enemyLevel = 4, withBase = true) {
  const base = createMockBase({ name: "Friendly Base" });
  const enemy = createMockUnit({ ap: 3, hp: 6, level: enemyLevel });
  const openingShield = createMockUnit({ name: "Opening Shield" });
  const engine = GundamTestEngine.create(
    {
      play: [gd02RickDiasRed075],
      baseSection: withBase ? [base] : [],
      shieldArea: [openingShield],
      deck: 5,
    },
    { play: [enemy], deck: 5 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const rickDiasId = p1.getCardsInZone("battleArea")[0]!;
  const baseId = p1.getCardsInZone("baseSection")[0];
  const enemyId = p2.getCardsInZone("battleArea")[0]!;
  restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  return { p1, p2, rickDiasId, baseId, enemyId };
}

describe("Rick Dias (Red) (GD02-075)", () => {
  it("requires its printed Lv.4 and three active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02RickDiasRed075],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02RickDiasRed075), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02RickDiasRed075)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02RickDiasRed075],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02RickDiasRed075), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02RickDiasRed075)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (AEUG) Trait", () => {
    it("becomes a Link Unit when paired with an AEUG Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02KamilleBidan097, linkCheck],
        play: [gd02RickDiasRed075],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
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

    it("does not become a Link Unit when paired with a Pilot from another faction", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02RickDiasRed075],
        resourceArea: activeResources(3),
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

  describe("【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.", () => {
    it("publishes the Base then enemy choices and applies AP-2 only during that battle", () => {
      const { p1, p2, rickDiasId, baseId, enemyId } = attackFixture();

      expectSuccess(p1.enterBattle(rickDiasId, enemyId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId!] }));
      expect(p1.isExhausted(baseId!)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.isExhausted(baseId!)).toBe(true);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(1);
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("does not offer the effect without an active friendly Base", () => {
      const { p1, p2, rickDiasId, enemyId } = attackFixture(4, false);

      expectSuccess(p1.enterBattle(rickDiasId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("does not offer the effect when its friendly Base was legally rested by a Command", () => {
      const restBase = restFriendlyBaseCommand();
      const base = createMockBase({ name: "Friendly Base" });
      const enemy = createMockUnit({ ap: 3, hp: 6, level: 4 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [restBase],
          play: [gd02RickDiasRed075],
          baseSection: [base],
          shieldArea: [openingShield],
          deck: 5,
        },
        { play: [enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const rickDiasId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));
      expectSuccess(p1.enterBattle(rickDiasId, enemyId));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("does not rest the Base when no enemy Unit is Lv.4 or lower", () => {
      const { p1, rickDiasId, baseId, enemyId } = attackFixture(5);

      expectSuccess(p1.enterBattle(rickDiasId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.isExhausted(baseId!)).toBe(false);
    });
  });
});
