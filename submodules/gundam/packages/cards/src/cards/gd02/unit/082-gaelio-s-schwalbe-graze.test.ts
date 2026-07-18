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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GaelioSSchwalbeGraze082 } from "./082-gaelio-s-schwalbe-graze.ts";
import { gd02GaelioBauduin099 } from "../pilot/099-gaelio-bauduin.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gaelio's Schwalbe Graze (GD02-082)", () => {
  it("requires its printed Lv.3 and two active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GaelioSSchwalbeGraze082],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GaelioSSchwalbeGraze082), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GaelioSSchwalbeGraze082)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GaelioSSchwalbeGraze082],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GaelioSSchwalbeGraze082), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GaelioSSchwalbeGraze082)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Gaelio Bauduin]", () => {
    it("becomes a Link Unit when paired with Gaelio Bauduin", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GaelioBauduin099, linkCheck],
        play: [gd02GaelioSSchwalbeGraze082],
        resourceArea: activeResources(3),
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

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02GaelioSSchwalbeGraze082],
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

  describe("While you have another (Gjallarhorn) Unit in play, this Unit gains <Blocker>.", () => {
    it("blocks a direct attack while another friendly Gjallarhorn Unit is in play", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const ally = createMockUnit({ traits: ["gjallarhorn"], hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        { play: [gd02GaelioSSchwalbeGraze082, ally], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const gaelioId = p2.getCardsInZone("battleArea")[0]!;

      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(gaelioId));

      expect(p2.isExhausted(gaelioId)).toBe(true);
    });

    it("cannot block with a friendly non-Gjallarhorn Unit and only an enemy Gjallarhorn Unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5, traits: ["gjallarhorn"] });
      const friendlyOutsider = createMockUnit({ traits: ["teiwaz"], hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        { play: [gd02GaelioSSchwalbeGraze082, friendlyOutsider], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const gaelioId = p2.getCardsInZone("battleArea")[0]!;

      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(gaelioId), "CANNOT_BLOCK_DIRECT");

      expect(p2.isExhausted(gaelioId)).toBe(false);
    });
  });
});
