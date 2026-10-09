// Official CR 2.2.0 6.1.1 and 6.1.13.2: only full resolution consumes once.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
  createMockSong,
} from "./index";

const source = createMockItem({
  id: "once-ready-source",
  name: "Once Ready",
  cost: 0,
  abilities: [
    {
      type: "triggered",
      trigger: {
        event: "play",
        on: { cardType: "song", controller: "you" },
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
            },
          ],
        },
      },
    },
  ],
});
const dancer = createMockCharacter({ id: "once-ready-dancer", name: "Dancer", cost: 3, lore: 1 });
const locked = createMockCharacter({
  id: "once-ready-locked",
  name: "Locked",
  cost: 3,
  abilities: [
    { type: "static", effect: { type: "restriction", restriction: "cant-ready", target: "SELF" } },
  ],
});
const songs = [0, 1, 2].map((i) =>
  createMockSong({ id: "once-ready-song-" + i, name: "Song " + i, cost: 0, text: "Test song." }),
);

describe("full resolution of once triggers", () => {
  for (const deferred of [false, true])
    for (const boundary of ["decline", "ready", "blocked"] as const) {
      it(`${boundary} preserves the use through ${deferred ? "a deferred target choice" : "direct bag resolution"}`, () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: songs,
          play: [source, { card: dancer, isDrying: false }, { card: locked, exerted: true }],
        });
        expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
        const first = g.asPlayerOne().getBagEffects()[0]!;
        if (deferred) {
          expect(
            g.asPlayerOne().resolveBag(first.id, { resolveOptional: true }),
          ).toBeSuccessfulCommand();
          expect(g.asPlayerOne().getPendingEffects()).toHaveLength(1);
          expect(
            g
              .asPlayerOne()
              .resolveNextPending(
                boundary === "decline"
                  ? { resolveOptional: false }
                  : { targets: [boundary === "blocked" ? locked : dancer] },
              ),
          ).toBeSuccessfulCommand();
        } else {
          expect(
            g
              .asPlayerOne()
              .resolveBag(
                first.id,
                boundary === "decline"
                  ? { resolveOptional: false }
                  : { resolveOptional: true, targets: [boundary === "blocked" ? locked : dancer] },
              ),
          ).toBeSuccessfulCommand();
        }
        expect(g.getLore(PLAYER_ONE)).toBe(0);
        expect(g.asPlayerOne().quest(dancer)).toBeSuccessfulCommand();
        expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getBagCount()).toBe(1);
        const second = g.asPlayerOne().getBagEffects()[0]!;
        if (deferred) {
          expect(
            g.asPlayerOne().resolveBag(second.id, { resolveOptional: true }),
          ).toBeSuccessfulCommand();
          expect(g.asPlayerOne().resolveNextPending({ targets: [dancer] })).toBeSuccessfulCommand();
        } else {
          expect(
            g.asPlayerOne().resolveBag(second.id, { resolveOptional: true, targets: [dancer] }),
          ).toBeSuccessfulCommand();
        }
        expect(g.asPlayerOne().isExerted(dancer)).toBe(false);
        expect(g.getLore(PLAYER_ONE)).toBe(2);
        expect(g.asPlayerOne().playCard(songs[2]!)).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getBagCount()).toBe(0);
        expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      });
    }
});
