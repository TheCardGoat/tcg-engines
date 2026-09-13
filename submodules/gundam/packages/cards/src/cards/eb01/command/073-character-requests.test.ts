import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { eb01CharacterRequests073 } from "./073-character-requests.ts";

const restedUnit = () => ({ card: createMockUnit(), exhausted: true });

describe("Character Requests (EB01-073)", () => {
  describe("【Burst】Draw 1.", () => {
    it("draws exactly 1 card when its revealed Shield Burst is accepted", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        { shieldArea: [eb01CharacterRequests073], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(2);
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getCardZone(eb01CharacterRequests073)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Main】If there are 6 or more rested Units in play, draw 2.", () => {
    it("draws exactly 2 cards at the six-rested-Unit threshold", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [eb01CharacterRequests073],
          play: [restedUnit(), restedUnit(), restedUnit()],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { play: [restedUnit(), restedUnit(), restedUnit()], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getHand()).toHaveLength(2);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not draw when only five Units are rested", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [eb01CharacterRequests073],
          play: [restedUnit(), restedUnit(), restedUnit()],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { play: [restedUnit(), restedUnit()], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.6 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [eb01CharacterRequests073],
        resourceArea: activeResources(5),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(eb01CharacterRequests073),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed cost without 2 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [eb01CharacterRequests073],
        resourceArea: restedResources(6),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(eb01CharacterRequests073),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
