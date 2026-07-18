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
import { gd02BusterGundam076 } from "./076-buster-gundam.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Buster Gundam (GD02-076)", () => {
  it("requires its printed Lv.4 and three active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02BusterGundam076],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02BusterGundam076), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02BusterGundam076)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02BusterGundam076],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02BusterGundam076), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02BusterGundam076)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (Coordinator) Trait", () => {
    it("becomes a Link Unit when paired with a Coordinator Pilot", () => {
      const pilot = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02BusterGundam076],
        resourceArea: activeResources(1),
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
      const pilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02BusterGundam076],
        resourceArea: activeResources(1),
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

  describe("While this Unit has 5 or more AP, it gains <Blocker>.", () => {
    it("does not have Blocker at its printed 4 AP", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02BusterGundam076],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02BusterGundam076));

      expect(p1.getVisibleCard(gd02BusterGundam076)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(gd02BusterGundam076)?.keywords).not.toContain("Blocker");
    });

    it("gains Blocker at 5 AP and can redirect a direct attack", () => {
      const pilot = createMockPilot({ apBonus: 1, level: 1, cost: 1 });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          hand: [pilot],
          play: [gd02BusterGundam076],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const busterId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(pilot, busterId));
      expect(p2.getVisibleCard(busterId)).toMatchObject({ effectiveAp: 5 });
      expect(p2.getVisibleCard(busterId)?.keywords).toContain("Blocker");
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(busterId));

      expect(p2.isExhausted(busterId)).toBe(true);
    });
  });
});
