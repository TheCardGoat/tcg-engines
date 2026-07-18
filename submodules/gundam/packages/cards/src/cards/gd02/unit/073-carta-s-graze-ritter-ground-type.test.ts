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
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02CartaSGrazeRitterGroundType073 } from "./073-carta-s-graze-ritter-ground-type.ts";
import { gd02PersistentAndFortudinous119 } from "../command/119-persistent-and-fortudinous.ts";
import { gd02GaelioBauduin099 } from "../pilot/099-gaelio-bauduin.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Carta's Graze Ritter (Ground Type) (GD02-073)", () => {
  it("requires its printed Lv.4 and three active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02CartaSGrazeRitterGroundType073],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(
      lowP1.deployUnit(gd02CartaSGrazeRitterGroundType073),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02CartaSGrazeRitterGroundType073)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02CartaSGrazeRitterGroundType073],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02CartaSGrazeRitterGroundType073), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02CartaSGrazeRitterGroundType073)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Carta Issue]", () => {
    it("becomes a Link Unit when paired with Carta Issue", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02PersistentAndFortudinous119, linkCheck],
        play: [gd02CartaSGrazeRitterGroundType073],
        resourceArea: activeResources(2),
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
        hand: [gd02GaelioBauduin099, linkCheck],
        play: [gd02CartaSGrazeRitterGroundType073],
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

  describe("During your opponent's turn, the enemy Unit battling this Unit gains <First Strike>.", () => {
    it("lets the opponent's attacker destroy Carta before Carta deals battle damage", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02CartaSGrazeRitterGroundType073], deck: 5 },
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const cartaId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [cartaId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, cartaId);

      expect(p1.getCardZone(cartaId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getDamage(attackerId)).toBe(0);
    });

    it("does not grant First Strike when the enemy attacker battles a different Unit", () => {
      const alternateTarget = createMockUnit({ ap: 5, hp: 4 });
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02CartaSGrazeRitterGroundType073, alternateTarget], deck: 5 },
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const alternateTargetId = p1.getCardsInZone("battleArea")[1]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [alternateTargetId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, alternateTargetId);

      expect(p1.getCardZone(alternateTargetId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(attackerId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not grant First Strike when Carta attacks on its controller's turn", () => {
      const target = createMockUnit({ ap: 4, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02CartaSGrazeRitterGroundType073], shieldArea: [openingShield], deck: 5 },
        { play: [target], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const cartaId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [targetId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, cartaId, targetId);

      expect(p1.getCardZone(cartaId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(targetId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });
});
