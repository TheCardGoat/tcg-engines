// CR 6.1.13.2 and 7.1.6: a limited-use ability belongs to this source's current lifetime.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "./index";
const source = createMockCharacter({
  id: "once-replayed",
  name: "Once Source",
  cost: 1,
  abilities: [
    {
      id: "once-replayed-ability",
      type: "triggered",
      trigger: {
        event: "play",
        on: { cardType: "song", controller: "you" },
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }, { type: "once-per-turn" }],
      },
      effect: { type: "gain-ink-drop", amount: 1, target: "CONTROLLER" },
    },
  ],
});
const song = (i: number) =>
  createMockSong({
    id: `once-song-${i}`,
    name: `Song ${i}`,
    cost: 0,
    text: "Gain 1 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } }],
  });
const bounce = (i: number) =>
  createMockAction({
    id: `once-bounce-${i}`,
    name: `Bounce ${i}`,
    cost: 0,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
describe("limited-use triggers after replay", () => {
  for (const initiallyPlayed of [false, true])
    it(`refreshes each source lifetime (initially played ${initiallyPlayed})`, () => {
      const songs = Array.from({ length: 6 }, (_, i) => song(i));
      const bounces = [bounce(1), bounce(2)];
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: initiallyPlayed ? [] : [source],
        hand: [...(initiallyPlayed ? [source] : []), ...songs, ...bounces],
        inkwell: 3,
      });
      if (initiallyPlayed) expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      for (let lifetime = 0; lifetime < 3; lifetime++) {
        expect(game.asPlayerOne().playCard(songs[lifetime * 2]!)).toBeSuccessfulCommand();
        expect(game.getInkDrops(PLAYER_ONE)).toBe(lifetime + 1);
        expect(game.asPlayerOne().playCard(songs[lifetime * 2 + 1]!)).toBeSuccessfulCommand();
        expect(game.getInkDrops(PLAYER_ONE)).toBe(lifetime + 1);
        if (lifetime < 2) {
          expect(
            game.asPlayerOne().playCard(bounces[lifetime]!, { targets: [source] }),
          ).toBeSuccessfulCommand();
          expect(game.asPlayerOne().getCardZone(source)).toBe("hand");
          expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
        }
      }
    });
});
