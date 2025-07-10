import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { notEmptyPredicate } from "@lorcanito/lorcana-engine";
import {
  liloGalacticHero,
  liloMakingAWish,
  mickeyBraveLittleTailor,
  mickeyMouseArtfulRogue,
  mickeyMouseDetective,
  mickeyMouseMusketeer,
  stichtCarefreeSurfer,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { stitchCovertAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { mickeyMousePlayfulSorcerer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  liloJuniorCakeDecorator,
  mickeyMouseEnthusiasticDancer,
  mickeyMouseFoodFightDefender,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import {
  liloEscapeArtist,
  mickeyMouseCourageousSailor,
  stitchAlienBuccaneer,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  createGameStartMachine,
  type gameStartMachine,
} from "@lorcanito/lorcana-engine/state-machines/matchStartMachine";
import { type ActorRefFrom, createActor } from "xstate";

describe("Game Start xState Machine", () => {
  let service: ActorRefFrom<typeof gameStartMachine>;
  let testEngine: TestEngine;

  beforeEach(() => {
    testEngine = new TestEngine(
      {
        deck: [
          liloGalacticHero,
          liloMakingAWish,
          liloJuniorCakeDecorator,
          liloEscapeArtist,
          stitchAlienBuccaneer,
          stichtNewDog,
          stitchCovertAgent,
          stichtCarefreeSurfer,
        ],
      },
      {
        deck: [
          mickeyMouseArtfulRogue,
          mickeyMouseDetective,
          mickeyMousePlayfulSorcerer,
          mickeyMouseFriendlyFace,
          mickeyBraveLittleTailor,
          mickeyMouseFoodFightDefender,
          mickeyMouseEnthusiasticDancer,
          mickeyMouseMusketeer,
          mickeyMouseCourageousSailor,
        ],
      },
      true,
      false,
    );

    service = createActor(
      createGameStartMachine({
        initialState: "choosingFirstPlayer",
        initialContext: {
          startingPlayer: "player_two",
          pendingAlteringHand: ["player_two", "player_one"],
          stateManager: testEngine.store,
          alteredCards: {},
        },
      }),
    );

    service.start();
  });

  afterEach(() => {
    service.stop();
  });

  test("Happy path", async () => {
    expect(service.getSnapshot().value).toEqual("choosingFirstPlayer");

    service.send({
      type: "CHOOSE_FIRST_PLAYER",
      order: ["player_two", "player_one"],
    });

    expect(service.getSnapshot().context.pendingAlteringHand).toEqual([
      "player_two",
      "player_one",
    ]);
    expect(service.getSnapshot().value).toEqual("alteringHands");

    {
      // First player mulligan
      expect(service.getSnapshot().context.pendingAlteringHand[0]).toEqual(
        "player_two",
      );

      const otherPlayerCardsToMulligan = [
        testEngine.getCardsByZone("hand", "player_two")[0],
        testEngine.getCardsByZone("hand", "player_two")[1],
      ].filter(notEmptyPredicate);

      otherPlayerCardsToMulligan.forEach((card) => {
        expect(card.zone).toBe("hand");
      });

      expect(service.getSnapshot().context.pendingAlteringHand).toContain(
        "player_two",
      );

      service.send({
        type: "ALTER_HANDS",
        playerId: "player_two",
        cards: otherPlayerCardsToMulligan.map((card) => card.instanceId),
      });

      expect(service.getSnapshot().value).toEqual("alteringHands");
      expect(service.getSnapshot().context.pendingAlteringHand).not.toContain(
        "player_two",
      );
      otherPlayerCardsToMulligan.forEach((card) => {
        expect(card.zone).toBe("deck");
      });
    }

    {
      // Second player mulligans
      expect(service.getSnapshot().context.pendingAlteringHand[0]).toEqual(
        "player_one",
      );
      const cardToMulligan = testEngine.getCardsByZone("hand", "player_one")[0];

      expect(cardToMulligan?.zone).toBe("hand");
      expect(service.getSnapshot().context.pendingAlteringHand).toContain(
        "player_one",
      );

      service.send({
        type: "ALTER_HANDS",
        playerId: "player_one",
        cards: [cardToMulligan?.instanceId || ""],
      });

      expect(cardToMulligan?.zone).toBe("deck");
      expect(service.getSnapshot().context.pendingAlteringHand).not.toContain(
        "player_one",
      );
    }

    expect(service.getSnapshot().context.pendingAlteringHand).toHaveLength(0);
    expect(service.getSnapshot().value).toContain("gameStarted");

    const store = testEngine.store;

    expect(store.choosingFirstPlayer).toBe("player_one");

    expect(store.firstPlayer).toBe("player_two");
    expect(store.turnPlayer).toBe("player_two");
    expect(store.priorityPlayer).toBe("player_two");

    // Tests are happening outside of the context of the store. Migrate tests to use Store Methods
    // expect(store.matchHasStarted).toBe(true);
  });
});
