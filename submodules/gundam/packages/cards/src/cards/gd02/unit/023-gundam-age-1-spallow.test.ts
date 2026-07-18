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
import { gd02GundamAge1Spallow023 } from "./023-gundam-age-1-spallow.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function placeExResourceCommand() {
  return createMockCommand({
    name: "Raise Player Level",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "placeExResource", state: "active" } }],
        sourceText: "【Main】Place 1 EX Resource.",
      },
    ],
  });
}

describe("Gundam AGE-1 Spallow (GD02-023)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Spallow023],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAge1Spallow023],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【During Link】While you are Lv.7 or higher, this Unit gains <First Strike>.", () => {
    it("uses First Strike at Lv.7 to destroy the defender without receiving return damage", () => {
      const defender = createMockUnit({ ap: 5, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02FlitAsuno088],
          play: [gd02GundamAge1Spallow023],
          resourceArea: activeResources(7),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [defender], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const spallowId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, spallowId));
      const flitChoice = p1.getBoardView().pendingChoice;
      if (flitChoice?.kind !== "deckLook") {
        throw new Error("Expected Flit Asuno's visible deck-look choice");
      }
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [flitChoice.directiveIndex]: {} } }));
      expect(p1.getVisibleCard(spallowId)?.keywords).toContain("FirstStrike");
      expectSuccess(p1.enterBattle(spallowId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getDamage(spallowId)).toBe(0);
    });

    it("does not gain First Strike while linked below Lv.7", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02FlitAsuno088],
        play: [gd02GundamAge1Spallow023],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const spallowId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02FlitAsuno088, spallowId));

      expect(p1.getVisibleCard(spallowId)?.keywords).not.toContain("FirstStrike");
    });

    it("does not gain First Strike at Lv.7 when the Pilot does not satisfy its Link Condition", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086],
        play: [gd02GundamAge1Spallow023],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const spallowId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02JeridMessa086, spallowId));

      expect(p1.getVisibleCard(spallowId)?.keywords).not.toContain("FirstStrike");
    });

    it("gains First Strike immediately when a legal EX Resource play raises the player to Lv.7", () => {
      const placeResource = placeExResourceCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02FlitAsuno088, placeResource],
        play: [gd02GundamAge1Spallow023],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const spallowId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02FlitAsuno088, spallowId));
      expect(p1.getVisibleCard(spallowId)?.keywords).not.toContain("FirstStrike");
      expectSuccess(p1.playCommand(placeResource));

      expect(p1.getResourceCount()).toBe(7);
      expect(p1.getVisibleCard(spallowId)?.keywords).toContain("FirstStrike");
    });
  });
});
