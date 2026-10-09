import { expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, createMockSong } from "./index";

const song = createMockSong({
  id: "song-discard-legal",
  name: "Legal Song",
  cost: 1,
  text: "Test song.",
});
const other = createMockCharacter({ id: "song-discard-other", name: "Other Card", cost: 1 });
const source = createMockCharacter({
  id: "song-discard-source",
  name: "Song Discard Source",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              filter: { type: "is-song" },
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: { type: "draw", amount: 2, target: "CONTROLLER" },
            },
          ],
        },
      },
    },
  ],
});

for (const songCount of [1, 2]) {
  it(`rejects a non-song with ${songCount} legal songs and leaves the effect available for retry`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source, other, ...Array.from({ length: songCount }, () => song)],
      inkwell: 1,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true, targets: [other] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(songCount + 1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
    const legalSong = game
      .getCardInstanceIdsInZone("hand", "player_one")
      .find((id) => game.getCardDefinitionId(id) === song.id)!;
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(source, { resolveOptional: true, targets: [legalSong] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(songCount + 2);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(4);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });
}
it("declining preserves a legal song and draws nothing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [source, song, other],
    inkwell: 1,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
  expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
});
it("accepting without any song finishes without discarding or drawing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [source, other],
    inkwell: 1,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount())
    expect(
      game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
  expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
});
