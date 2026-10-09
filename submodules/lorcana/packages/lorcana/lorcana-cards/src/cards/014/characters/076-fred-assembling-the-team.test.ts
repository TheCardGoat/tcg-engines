import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { fredAssemblingTheTeam } from "./076-fred-assembling-the-team";

const superAlly = createMockCharacter({
  id: "fred-team-super-ally",
  name: "Super Friend",
  cost: 3,
  classifications: ["Storyborn", "Hero", "Super"],
});

const plainCharacter = createMockCharacter({
  id: "fred-team-plain-a",
  name: "Plain Friend A",
  cost: 2,
});

const plainCharacterB = createMockCharacter({
  id: "fred-team-plain-b",
  name: "Plain Friend B",
  cost: 2,
});

const gadget = createMockItem({
  id: "fred-team-gadget",
  name: "Useful Gadget",
  cost: 2,
});

const landmark = createMockLocation({
  id: "fred-team-landmark",
  name: "Some Landmark",
  cost: 2,
});

describe("Fred - Assembling the Team", () => {
  it("Brain Trust puts a Super character card into your hand and the rest on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAssemblingTheTeam],
      inkwell: fredAssemblingTheTeam.cost,
      deck: [plainCharacter, superAlly, landmark, plainCharacterB],
    });

    expect(testEngine.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [superAlly] },
          { zone: "deck-bottom", cards: [plainCharacter, landmark, plainCharacterB] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(superAlly)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(plainCharacter)).toBe("deck");
  });

  it("Brain Trust can take an item card instead", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAssemblingTheTeam],
      inkwell: fredAssemblingTheTeam.cost,
      deck: [plainCharacter, gadget, landmark, plainCharacterB],
    });

    expect(testEngine.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [gadget] },
          { zone: "deck-bottom", cards: [plainCharacter, landmark, plainCharacterB] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(gadget)).toBe("hand");
  });

  it("a plain character is not a legal pick and stays in the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAssemblingTheTeam],
      inkwell: fredAssemblingTheTeam.cost,
      deck: [plainCharacter, plainCharacterB, landmark],
    });

    expect(testEngine.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(plainCharacter)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(3);
  });
});

describe("Brain Trust boundaries", () => {
  function setup(cards = [gadget, plainCharacter, superAlly, landmark, plainCharacterB]) {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [fredAssemblingTheTeam], inkwell: 3, deck: cards },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
    return game;
  }
  for (const cards of [[plainCharacter], [superAlly, gadget], [gadget]]) {
    it(`rejects illegal picks ${cards.map((c) => c.id)}`, () => {
      const game =
        cards.length > 1 ? setup([plainCharacter, superAlly, gadget, landmark]) : setup();
      expect(
        game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
          destinations: [
            { zone: "hand", cards },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  }
  it("takes only from the top four and preserves the chosen bottom order below untouched cards", () => {
    const game = setup();
    expect(
      game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        destinations: [
          { zone: "hand", cards: [superAlly] },
          { zone: "deck-bottom", cards: [landmark, plainCharacterB, plainCharacter] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(
      game.getCardInstanceIdsInZone("deck", PLAYER_ONE).map((id) => game.getCardDefinitionId(id)),
    ).toEqual([plainCharacter.id, plainCharacterB.id, landmark.id, gadget.id]);
  });
  it("declines taking an eligible card and puts all four on the bottom", () => {
    const game = setup();
    expect(
      game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [landmark, plainCharacterB, superAlly, plainCharacter] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(
      game.getCardInstanceIdsInZone("deck", PLAYER_ONE).map((id) => game.getCardDefinitionId(id)),
    ).toEqual([plainCharacter.id, superAlly.id, plainCharacterB.id, landmark.id, gadget.id]);
  });
  it("handles fewer than four deck cards", () => {
    const game = setup([gadget]);
    expect(
      game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
        destinations: [
          { zone: "hand", cards: [gadget] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(gadget)).toBe("hand");
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });
  it("does not prompt or attempt a draw with an empty deck", () => {
    const game = setup([]);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
});

it("reveals only the selected card in public logs, while looked-at remainder stays private", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredAssemblingTheTeam],
    inkwell: 3,
    deck: [plainCharacter, gadget, landmark, plainCharacterB],
  });
  const lookedIds = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const picked = game.findCardInstanceId(gadget, "deck", PLAYER_ONE)!;
  expect(game.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({
      destinations: [
        { zone: "hand", cards: [gadget] },
        { zone: "deck-bottom", cards: [plainCharacter, landmark, plainCharacterB] },
      ],
    }),
  ).toBeSuccessfulCommand();
  const publicLog = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(publicLog).toContain(picked);
  for (const id of lookedIds.filter((id) => id !== picked)) expect(publicLog).not.toContain(id);
});

it("player two takes their Super and keeps remainder order below the untouched card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [gadget], deck: [landmark, plainCharacter] },
    {
      hand: [fredAssemblingTheTeam],
      inkwell: 3,
      deck: [gadget, plainCharacter, superAlly, landmark, plainCharacterB, gadget],
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().resolvePendingByCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolveNextPending({
      destinations: [
        { zone: "hand", cards: [game.findCardInstanceId(superAlly, "deck", PLAYER_TWO)!] },
        {
          zone: "deck-bottom",
          cards: [landmark, plainCharacterB, plainCharacter].map(
            (card) => game.findCardInstanceId(card, "deck", PLAYER_TWO)!,
          ),
        },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(superAlly)).toBe("hand");
  expect(
    game.getCardInstanceIdsInZone("deck", PLAYER_TWO).map((id) => game.getCardDefinitionId(id)),
  ).toEqual([plainCharacter.id, plainCharacterB.id, landmark.id, gadget.id]);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(
    game.getCardInstanceIdsInZone("deck", PLAYER_ONE).map((id) => game.getCardDefinitionId(id)),
  ).toEqual([landmark.id, plainCharacter.id]);
});

it("direct bag resolution publicly reveals the selected Super and hides the remainder", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredAssemblingTheTeam],
    inkwell: 3,
    deck: [plainCharacter, superAlly, landmark, plainCharacterB],
  });
  const picked = game.findCardInstanceId(superAlly, "deck", PLAYER_ONE)!;
  const hidden = [plainCharacter, landmark, plainCharacterB].map(
    (card) => game.findCardInstanceId(card, "deck", PLAYER_ONE)!,
  );
  expect(game.asPlayerOne().playCard(fredAssemblingTheTeam)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(fredAssemblingTheTeam, {
      destinations: [
        { zone: "hand", cards: [picked] },
        { zone: "deck-bottom", cards: hidden },
      ],
    }),
  ).toBeSuccessfulCommand();
  const publicLog = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(publicLog).toContain(picked);
  for (const id of hidden) expect(publicLog).not.toContain(id);
});
