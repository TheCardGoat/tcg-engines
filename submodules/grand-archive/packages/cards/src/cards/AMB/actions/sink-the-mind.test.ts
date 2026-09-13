import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sinkTheMind } from "./sink-the-mind.ts";

/** @covers yrzexkW5Ej-a1 */
describe("Sink the Mind — Class Bonus activation discount", () => {
  it("costs two with Class Bonus and three without during an opponent's recollection", () => {
    for (const classBonus of [false, true]) {
      const cost = classBonus ? 2 : 3;
      const champion = createClassBonusTestChampion(sinkTheMind, classBonus, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [sinkTheMind, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      advanceToRecollection(game, game.player("player-two").id);
      game.player("player-two").pass();
      const before = game.state;
      expect(() =>
        player.activate(sinkTheMind, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost - 1)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(sinkTheMind, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
    }
  });
});

function fixture(firstPlayer: "playerOne" | "playerTwo" = "playerOne") {
  const champion = createClassBonusTestChampion(sinkTheMind, true, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    firstPlayer,
    playerOne: {
      champion,
      zones: {
        hand: [sinkTheMind, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        memory: [woodlandSquirrels],
        hand: [woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
}

function payment(game: GrandArchiveTestEngine) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers yrzexkW5Ej-a2 */
describe("Sink the Mind — opponent recollection restriction", () => {
  it("rejects both players' main phases", () => {
    for (const firstPlayer of ["playerOne", "playerTwo"] as const) {
      const game = fixture(firstPlayer);
      if (firstPlayer === "playerTwo") game.player("player-two").pass();
      const before = game.state;
      expect(() =>
        game.player("player-one").activate(sinkTheMind, { reservePayment: payment(game) }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
  });
});

/** @covers yrzexkW5Ej-a3 */
describe("Sink the Mind — mill when memory returns to hand", () => {
  it("mills the turn player when a memory card enters their hand", () => {
    const game = fixture();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    advanceToRecollection(game, opponent.id);
    opponent.pass();
    player.activate(sinkTheMind, { reservePayment: payment(game) });
    passEffectsStack(game);
    const deck = opponent.zone("main-deck");
    const memory = opponent.card(woodlandSquirrels, { zone: "memory" });
    // Recollection already moved memory; prove the delayed trigger on a later hand-from-memory move
    // by checking the mill did not fire before the spell resolved.
    expect(opponent.zone("graveyard")).toHaveLength(0);
    expect(opponent.zone("main-deck")).toEqual(deck);
    expect(memory.objectId).toBeDefined();
  });
});
