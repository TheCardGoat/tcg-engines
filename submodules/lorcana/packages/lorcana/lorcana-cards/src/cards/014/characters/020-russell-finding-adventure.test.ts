import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { russellFindingAdventure } from "./020-russell-finding-adventure";

const characterCard = createMockCharacter({
  id: "russell-character-card",
  name: "Deck Character",
  cost: 2,
});

const actionCard = createMockAction({
  id: "russell-action-card",
  name: "Deck Action",
  cost: 2,
  text: "An action.",
});

describe("Russell - Finding Adventure", () => {
  it("reveals the top 2 cards, puts the character into hand and the rest on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard, actionCard],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(russellFindingAdventure, {
        ability: "Hide and Seek",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.isExerted(russellFindingAdventure)).toBe(true);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [characterCard] },
          { zone: "deck-bottom", cards: [actionCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(characterCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(actionCard)).toBe("deck");
  });

  it("puts both cards on the bottom when neither is a character", () => {
    const actionOne = createMockAction({
      id: "russell-action-one",
      name: "Deck Action One",
      cost: 1,
      text: "An action.",
    });
    const actionTwo = createMockAction({
      id: "russell-action-two",
      name: "Deck Action Two",
      cost: 1,
      text: "An action.",
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [russellFindingAdventure],
        deck: [actionOne, actionTwo],
      },
      { deck: 6 },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(russellFindingAdventure, {
        ability: "Hide and Seek",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "deck-bottom", cards: [actionTwo, actionOne] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(actionOne)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(actionTwo)).toBe("deck");
    // The requested order is top-first; the engine stores the top card last.
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      actionOne.id,
      actionTwo.id,
    ]);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(actionTwo)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(actionOne)).toBe("deck");
    expect(testEngine.asPlayerOne().hasGameEnded()).toBe(false);
  });
  it("cannot put a revealed character on the bottom instead of into hand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard, actionCard],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "deck-bottom", cards: [characterCard, actionCard] }],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "deck-bottom", cards: [actionCard] }],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(characterCard)).toBe("hand");
  });

  it("puts every revealed character into hand without requiring an optional selection", () => {
    const secondCharacter = createMockCharacter({
      id: "russell-second-character",
      cost: 1,
      name: "Second Character",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard, secondCharacter],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().resolveNextPending({ destinations: [] })).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(characterCard)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(secondCharacter)).toBe("hand");
  });

  it("works with only one card left and cannot activate again while exerted", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().resolveNextPending({ destinations: [] })).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(characterCard)).toBe("hand");
    expect(
      engine.asPlayerOne().activateAbility(russellFindingAdventure),
    ).not.toBeSuccessfulCommand();
  });

  it("keeps the chosen bottom order and leaves the untouched card above it", () => {
    const secondAction = createMockAction({
      id: "russell-order-action",
      cost: 1,
      name: "Second Action",
      text: "An action.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard, actionCard, secondAction],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "deck-bottom", cards: [actionCard, secondAction] }],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardDefinitionIdsInZone("deck", "player_one")).toEqual([
      secondAction.id,
      actionCard.id,
      characterCard.id,
    ]);
  });

  it("reveals both card types publicly while the choice is pending", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [characterCard, actionCard],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    const windows = engine.getAuthoritativeState().ctx.zones.reveals.active;
    expect(windows).toHaveLength(1);
    expect(windows[0]?.visibleTo).toBe("all");
    expect(windows[0]?.cardIDs).toHaveLength(2);
    expect(engine.asPlayerOne().resolveNextPending({ destinations: [] })).toBeSuccessfulCommand();
    expect(
      engine
        .getAuthoritativeState()
        .ctx.zones.reveals.active.some((window) => window.revealID === windows[0]?.revealID),
    ).toBe(false);
  });

  it("finishes with an empty deck without a choice or a draw loss", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellFindingAdventure],
      deck: [],
    });
    expect(engine.asPlayerOne().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.getStateForView("playerOne").status).toBe("playing");
  });

  it("cannot activate its exert ability while drying", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: russellFindingAdventure, isDrying: true }],
      deck: [characterCard],
    });
    expect(
      engine.asPlayerOne().activateAbility(russellFindingAdventure),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(russellFindingAdventure)).toBe(false);
  });
  it("Player Two reveals their own top cards and only they can order the remainder", () => {
    const drawnCard = createMockAction({ id: "russell-normal-draw", name: "Normal Draw", cost: 1 });
    const untouchedCard = { ...actionCard, id: "russell-untouched" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        play: [russellFindingAdventure],
        deck: [untouchedCard, characterCard, actionCard, drawnCard],
        inkwell: 2,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(drawnCard)).toBe("hand");
    expect(game.asPlayerTwo().activateAbility(russellFindingAdventure)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(russellFindingAdventure)).toBe(true);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(
      game
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "deck-bottom", cards: [actionCard] }] })
        .success,
    ).toBe(false);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(1);
    expect(
      game
        .asPlayerTwo()
        .resolveNextPending({ destinations: [{ zone: "deck-bottom", cards: [actionCard] }] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(characterCard)).toBe("hand");
    expect(game.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([
      actionCard.id,
      untouchedCard.id,
    ]);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
});
