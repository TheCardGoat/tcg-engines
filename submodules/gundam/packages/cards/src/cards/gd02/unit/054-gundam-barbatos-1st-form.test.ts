import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GundamBarbatos1stForm054 } from "./054-gundam-barbatos-1st-form.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Barbatos 1st Form (GD02-054)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamBarbatos1stForm054],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamBarbatos1stForm054],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Mikazuki Augus]", () => {
    it("becomes a Link Unit when paired with Mikazuki Augus", () => {
      const pilot = createMockPilot({ name: "Mikazuki Augus", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamBarbatos1stForm054],
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

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamBarbatos1stForm054],
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

  describe("【Attack】If this Unit is damaged, draw 1.", () => {
    it("draws 1 after receiving battle damage and later attacking", () => {
      const damageDealer = createMockUnit({ ap: 1, hp: 5 });
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GundamBarbatos1stForm054],
          deck: 6,
          shieldArea: [firstShield],
        },
        { play: [damageDealer], deck: 6, shieldArea: [secondShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;
      const damageDealerId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [barbatosId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, damageDealerId, barbatosId);
      expect(p1.getDamage(barbatosId)).toBe(1);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      const handBefore = p1.getBoardView().players[PLAYER_ONE]!.handCount;
      expectSuccess(p1.enterBattle(barbatosId, damageDealerId));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(handBefore + 1);
    });

    it("does not draw while attacking undamaged", () => {
      const defender = createMockUnit({ hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GundamBarbatos1stForm054],
          deck: 5,
          shieldArea: [openingShield],
        },
        { play: [defender], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      expectSuccess(p1.enterBattle(barbatosId, defenderId));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    });
  });
});
