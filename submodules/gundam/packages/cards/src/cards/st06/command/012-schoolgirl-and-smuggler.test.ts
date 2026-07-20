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
  restedResources,
} from "@tcg/gundam-engine";
import { st06SchoolgirlAndSmuggler012 } from "./012-schoolgirl-and-smuggler.ts";

describe("Schoolgirl and Smuggler (ST06-012)", () => {
  describe("【Main】top-three Clan Unit/Pilot tutor", () => {
    it("offers Clan Units and Pilots, adds one chosen physical card, and trashes the Command", () => {
      const clanUnit = createMockUnit({ traits: ["clan"] });
      const clanPilot = createMockPilot({ traits: ["clan"] });
      const nonMatch = createMockUnit({ traits: ["zeon"] });
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: [clanUnit, clanPilot, nonMatch],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible top-three choice");
      expect(choice).toMatchObject({
        sourceCardId: commandId,
        randomizeRemainingToBottom: true,
      });
      expect(choice.revealedCardIds).toHaveLength(3);
      expect(choice.legalTutorCardIds).toHaveLength(2);
      const chosenId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );

      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    });

    it("does not offer a Clan Command or non-Clan Unit/Pilot", () => {
      const clanCommand = createMockCommand({ traits: ["clan"] });
      const nonClanUnit = createMockUnit({ traits: ["zeon"] });
      const nonClanPilot = createMockPilot({ traits: ["newtype"] });
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: [clanCommand, nonClanUnit, nonClanPilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(st06SchoolgirlAndSmuggler012));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible top-three choice");
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("may decline eligible cards and returns all three to the deck", () => {
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: [
          createMockUnit({ traits: ["clan"] }),
          createMockPilot({ traits: ["clan"] }),
          createMockUnit(),
        ],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(st06SchoolgirlAndSmuggler012));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible top-three choice");
      expect(choice.legalTutorCardIds).toHaveLength(2);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not allow the controller to choose the randomized bottom-deck order", () => {
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: [createMockUnit(), createMockUnit(), createMockUnit()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.playCommand(st06SchoolgirlAndSmuggler012));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible top-three choice");

      expectFailure(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toBottom: choice.revealedCardIds },
          },
        }),
        "INVALID_DECK_LOOK_ROUTING",
      );
      expect(p1.getBoardView().pendingChoice?.kind).toBe("deckLook");
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));
    });

    it("looks at only the available cards when fewer than three remain", () => {
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: [createMockUnit({ traits: ["clan"] }), createMockUnit()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.playCommand(st06SchoolgirlAndSmuggler012));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(2);
      const chosenId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );
      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("resolves and trashes itself cleanly with an empty deck", () => {
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot be played during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(st06SchoolgirlAndSmuggler012), "WRONG_TIMING");
      expect(p1.getCardZone(st06SchoolgirlAndSmuggler012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("enforces printed Lv.1 and cost 1 without moving the source", () => {
      const lowLevel = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        deck: 3,
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        lowLevel.playCommand(st06SchoolgirlAndSmuggler012),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(lowLevel.getCardZone(st06SchoolgirlAndSmuggler012)).toBe(`hand:${PLAYER_ONE}`);

      const noPayment = GundamTestEngine.create({
        hand: [st06SchoolgirlAndSmuggler012],
        resourceArea: restedResources(1),
        deck: 3,
      }).asPlayer(PLAYER_ONE);
      expectFailure(noPayment.playCommand(st06SchoolgirlAndSmuggler012), "INSUFFICIENT_RESOURCES");
      expect(noPayment.getCardZone(st06SchoolgirlAndSmuggler012)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
