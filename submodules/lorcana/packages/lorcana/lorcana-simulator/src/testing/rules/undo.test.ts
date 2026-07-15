import { describe, expect, it } from "bun:test";
import {
  arielOnHumanLegs,
  simbaProtectiveCub,
  stitchNewDog,
  friendsOnTheOtherSide,
} from "@tcg/lorcana-cards/cards/001";
import { theBareNecessities } from "@tcg/lorcana-cards/cards/003";
import { stitchCarefreeSnowboarder } from "@tcg/lorcana-cards/cards/011";
import {
  getLorcanaServerAuthoritativeSnapshot,
  loadLorcanaServerAuthoritativeSnapshot,
} from "@tcg/lorcana-engine";
import type { MatchStaticResources } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";

const inkableCard = arielOnHumanLegs;
const vanillaCharacter = stitchNewDog;
const drawAction = friendsOnTheOtherSide;
const revealAction = theBareNecessities;

function getServerCardCatalog(server: { getResolvedStaticResources(): MatchStaticResources }) {
  return server.getResolvedStaticResources().cards;
}

describe("Undo", () => {
  describe("undoable moves", () => {
    it("ink a card -> undo succeeds -> card back in hand, ink restored", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        deck: 1,
      });

      const server = engine.getServerEngine();
      const initialStateID = server.getStateID();

      expect(engine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(engine.asPlayerOne().getZonesCardCount().inkwell).toBe(1);
      expect(server.getStateID()).toBe(initialStateID + 1);

      expect(server.canUndo(PLAYER_ONE)).toBe(true);
      expect(server.undo(PLAYER_ONE).success).toBe(true);

      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(engine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
      expect(engine.asPlayerOne().getCardZone(inkableCard)).toBe("hand");
      expect(server.getStateID()).toBe(initialStateID + 2);
      expect(server.getMoveHistory()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            moveId: "putCardIntoInkwell",
            transitionType: "move",
            newStateID: initialStateID + 1,
          }),
          expect.objectContaining({
            moveId: "undo",
            transitionType: "undo",
            undoneStateID: initialStateID + 1,
            restoredCheckpointStateID: initialStateID,
            newStateID: initialStateID + 2,
            undoneMoveId: "putCardIntoInkwell",
          }),
        ]),
      );
    });

    it("play character from hand -> undo succeeds -> card returns to hand", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [vanillaCharacter],
        inkwell: vanillaCharacter.cost,
        deck: 1,
      });

      const server = engine.getServerEngine();
      const initialStateID = server.getStateID();

      expect(engine.asPlayerOne().playCard(vanillaCharacter)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(vanillaCharacter)).toBe("play");
      expect(server.getStateID()).toBe(initialStateID + 1);

      expect(server.canUndo(PLAYER_ONE)).toBe(true);
      expect(server.undo(PLAYER_ONE).success).toBe(true);

      expect(engine.asPlayerOne().getCardZone(vanillaCharacter)).toBe("hand");
      expect(server.getStateID()).toBe(initialStateID + 2);
      expect(server.getMoveHistory()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            moveId: "playCard",
            transitionType: "move",
            newStateID: initialStateID + 1,
          }),
          expect.objectContaining({
            moveId: "undo",
            transitionType: "undo",
            undoneStateID: initialStateID + 1,
            restoredCheckpointStateID: initialStateID,
            newStateID: initialStateID + 2,
            undoneMoveId: "playCard",
          }),
        ]),
      );
    });

    it("quest with character -> undo succeeds -> lore reverted, card readied", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vanillaCharacter],
        deck: 1,
      });

      const server = engine.getServerEngine();
      const initialStateID = server.getStateID();
      const loreBefore = engine.asPlayerOne().getLore(PLAYER_ONE);

      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + vanillaCharacter.lore);
      expect(engine.asPlayerOne().isExerted(vanillaCharacter)).toBe(true);
      expect(server.getStateID()).toBe(initialStateID + 1);

      expect(server.canUndo(PLAYER_ONE)).toBe(true);
      expect(server.undo(PLAYER_ONE).success).toBe(true);

      expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(engine.asPlayerOne().isExerted(vanillaCharacter)).toBe(false);
      expect(server.getStateID()).toBe(initialStateID + 2);
      expect(server.getMoveHistory()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            moveId: "quest",
            transitionType: "move",
            newStateID: initialStateID + 1,
          }),
          expect.objectContaining({
            moveId: "undo",
            transitionType: "undo",
            undoneStateID: initialStateID + 1,
            restoredCheckpointStateID: initialStateID,
            newStateID: initialStateID + 2,
            undoneMoveId: "quest",
          }),
        ]),
      );
    });

    it("challenge (no triggered draw) -> undo succeeds -> damage reverted", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: arielOnHumanLegs, exerted: false }],
          inkwell: arielOnHumanLegs.cost,
          deck: 1,
        },
        {
          play: [{ card: vanillaCharacter, exerted: true }],
          deck: 1,
        },
      );

      const server = engine.getServerEngine();

      expect(
        engine.asPlayerOne().challenge(arielOnHumanLegs, vanillaCharacter),
      ).toBeSuccessfulCommand();

      expect(server.canUndo(PLAYER_ONE)).toBe(true);
      expect(server.undo(PLAYER_ONE).success).toBe(true);

      // After undo, damage should be reverted
      expect(engine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
      expect(engine.asPlayerOne().isExerted(arielOnHumanLegs)).toBe(false);
    });
  });

  describe("non-undoable moves", () => {
    it("play action card that draws -> undo fails (info revealed)", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drawAction],
        inkwell: drawAction.cost,
        deck: 10,
      });

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().playCard(drawAction)).toBeSuccessfulCommand();

      expect(server.canUndo(PLAYER_ONE)).toBe(false);
      expect(server.undo(PLAYER_ONE).success).toBe(false);
    });

    it("play action card that reveals opponent hand -> undo fails (info revealed)", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [revealAction],
          inkwell: revealAction.cost,
          deck: 1,
        },
        {
          hand: [inkableCard],
          deck: 1,
        },
      );

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().playCard(revealAction)).toBeSuccessfulCommand();

      expect(server.canUndo(PLAYER_ONE)).toBe(false);
      expect(server.undo(PLAYER_ONE).success).toBe(false);
    });

    it("trigger resolution that draws cards clears earlier undoable history", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCarefreeSnowboarder, vanillaCharacter, simbaProtectiveCub],
        deck: 3,
      });

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().quest(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getBagCount()).toBe(1);
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      expect(
        engine.asPlayerOne().resolvePendingByCard(stitchCarefreeSnowboarder, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(engine.asPlayerOne().getBagCount()).toBe(0);
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(server.canUndo(PLAYER_ONE)).toBe(false);
      expect(server.undo(PLAYER_ONE).success).toBe(false);
    });
  });

  describe("undo restrictions", () => {
    it("only the acting player can undo (opponent request rejected)", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanillaCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();

      expect(server.canUndo(PLAYER_ONE)).toBe(true);
      expect(server.canUndo(PLAYER_TWO)).toBe(false);
      expect(server.undo(PLAYER_TWO).success).toBe(false);

      // Player one can still undo
      expect(server.canUndo(PLAYER_ONE)).toBe(true);
    });

    it("player can undo the full contiguous tail one step at a time", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vanillaCharacter, simbaProtectiveCub],
        deck: 1,
      });

      const server = engine.getServerEngine();
      const loreBefore = engine.asPlayerOne().getLore(PLAYER_ONE);

      // First move: quest with Stitch
      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      // Second move: quest with Simba
      expect(engine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      // First undo restores Simba's quest, not Stitch's
      expect(server.undo(PLAYER_ONE).success).toBe(true);
      expect(engine.asPlayerOne().isExerted(vanillaCharacter)).toBe(true);
      expect(engine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
      expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + vanillaCharacter.lore);
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      // Second undo restores Stitch's earlier quest
      expect(server.undo(PLAYER_ONE).success).toBe(true);
      expect(engine.asPlayerOne().isExerted(vanillaCharacter)).toBe(false);
      expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(server.canUndo(PLAYER_ONE)).toBe(false);

      // No older contiguous undoable history remains
      expect(server.undo(PLAYER_ONE).success).toBe(false);
    });

    it("player client sees undo after ink and can execute it", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        deck: 1,
      });

      const playerOne = engine.asPlayerOne();

      expect(playerOne.canUndo()).toBe(false);
      expect(playerOne.ink(inkableCard)).toBeSuccessfulCommand();
      expect(playerOne.canUndo()).toBe(true);

      const undoResult = playerOne.undo();
      expect(undoResult.success).toBe(true);
      expect(playerOne.canUndo()).toBe(false);
      expect(playerOne.getCardZone(inkableCard)).toBe("hand");
      expect(playerOne.getZonesCardCount().inkwell).toBe(0);
      expect(playerOne.getStateID()).toBe(2);
    });

    it("pass turn -> undo checkpoint cleared (same-turn scope)", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanillaCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      // Pass turn clears checkpoint (passTurn triggers draw -> info revealed -> non-undoable)
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(false);
      expect(server.canUndo(PLAYER_TWO)).toBe(false);
    });

    it("non-undoable move clears previous checkpoint", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drawAction],
        play: [vanillaCharacter],
        inkwell: drawAction.cost,
        deck: 10,
      });

      const server = engine.getServerEngine();

      // Undoable move
      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      // Non-undoable move clears checkpoint
      expect(engine.asPlayerOne().playCard(drawAction)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(false);
    });

    it("opponent-authored commands break the undo tail", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanillaCharacter],
          deck: 1,
        },
        {
          play: [simbaProtectiveCub],
          deck: 1,
        },
      );

      const server = engine.getServerEngine();

      expect(engine.asPlayerOne().quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(true);

      expect(server.concede(PLAYER_TWO)).toBeSuccessfulCommand();
      expect(server.canUndo(PLAYER_ONE)).toBe(false);
      expect(server.undo(PLAYER_ONE).success).toBe(false);
    });

    it("player client can repeatedly undo across authoritative round-trips", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vanillaCharacter, simbaProtectiveCub],
        deck: 1,
      });

      const playerOne = engine.asPlayerOne();
      const loreBefore = playerOne.getLore(PLAYER_ONE);

      expect(playerOne.canUndo()).toBe(false);
      expect(playerOne.quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(playerOne.quest(simbaProtectiveCub)).toBeSuccessfulCommand();
      expect(playerOne.canUndo()).toBe(true);

      expect(playerOne.undo().success).toBe(true);
      expect(playerOne.canUndo()).toBe(true);
      expect(playerOne.isExerted(vanillaCharacter)).toBe(true);
      expect(playerOne.isExerted(simbaProtectiveCub)).toBe(false);
      expect(playerOne.getLore(PLAYER_ONE)).toBe(loreBefore + vanillaCharacter.lore);

      expect(playerOne.undo().success).toBe(true);
      expect(playerOne.canUndo()).toBe(false);
      expect(playerOne.isExerted(vanillaCharacter)).toBe(false);
      expect(playerOne.getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(playerOne.undo().success).toBe(false);
    });

    it("restores the undo stack from authoritative snapshot", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vanillaCharacter, simbaProtectiveCub],
        deck: 1,
      });
      const server = engine.asServer();
      const playerOne = engine.asPlayerOne();

      expect(playerOne.quest(vanillaCharacter)).toBeSuccessfulCommand();
      expect(playerOne.quest(simbaProtectiveCub)).toBeSuccessfulCommand();

      const snapshot = getLorcanaServerAuthoritativeSnapshot(server, engine.getCardsMaps());
      expect(snapshot.undoStack).toHaveLength(2);

      const restoredServer = loadLorcanaServerAuthoritativeSnapshot(
        snapshot,
        getServerCardCatalog(
          server as typeof server & {
            getResolvedStaticResources(): MatchStaticResources;
          },
        ),
      );

      expect(restoredServer.canUndo(PLAYER_ONE)).toBe(true);
      expect(restoredServer.undo(PLAYER_ONE).success).toBe(true);
      expect(restoredServer.canUndo(PLAYER_ONE)).toBe(true);
      expect(restoredServer.undo(PLAYER_ONE).success).toBe(true);
      expect(restoredServer.canUndo(PLAYER_ONE)).toBe(false);
    });
  });
});
