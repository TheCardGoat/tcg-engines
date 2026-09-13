import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blindingLapse } from "./blinding-lapse.ts";

/** @covers rKKDhaLJ8w-a1 */
describe("Blinding Lapse — high-influence hand into memory then random banish", () => {
  it("requires influence 9 and then banishes three from the filled memory", () => {
    const champion = createClassBonusTestChampion(blindingLapse, false, "activation-discount");
    const tooSmall = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [blindingLapse, ...Array.from({ length: 3 }, () => woodlandSquirrels)] },
      },
      playerTwo: {
        champion,
        zones: { hand: Array.from({ length: 4 }, () => woodlandSquirrels), memory: [] },
      },
    });
    const before = tooSmall.state;
    expect(() =>
      tooSmall.player("player-one").activate(blindingLapse, {
        reservePayment: tooSmall
          .player("player-one")
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-opponent": [tooSmall.player("player-two").id] },
      }),
    ).toThrow();
    expect(tooSmall.state).toEqual(before);

    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [blindingLapse, ...Array.from({ length: 3 }, () => woodlandSquirrels)] },
      },
      playerTwo: {
        champion,
        zones: {
          hand: Array.from({ length: 5 }, () => woodlandSquirrels),
          memory: Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(blindingLapse, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-opponent": [opponent.id] },
    });
    passEffectsStack(game);
    expect(opponent.zone("hand")).toHaveLength(0);
    expect(opponent.zone("memory")).toHaveLength(6);
    expect(opponent.zone("banishment")).toHaveLength(3);
  });
});
