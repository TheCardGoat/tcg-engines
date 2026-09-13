import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { bairuiResplendentBarrier } from "./bairui-resplendent-barrier.ts";

/** @covers sqGcyYocLW-a1 */
describe("Bairui, Resplendent Barrier — damage prevention", () => {
  it("prevents 2 damage and gains a charge counter", () => {
    const { starter } = classBonusLeveledChampion(bairuiResplendentBarrier, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        zones: {
          hand: [bairuiResplendentBarrier, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    advanceToMain(game, player.id);
    player.activate(bairuiResplendentBarrier, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    const source = player.card(bairuiResplendentBarrier, { zone: "field" });
    const champion = player.card(starter, { zone: "field" });
    advanceToMain(game, game.player("player-two").id);
    game.player("player-two").declareAttack(woodlandSquirrels, champion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[champion.objectId]!.damage).toBe(0);
    expect(game.state.objects[source.objectId]!.counters["named:charge"]).toBe(1);
  });
});

/** @covers sqGcyYocLW-a2 */
describe("Bairui, Resplendent Barrier — Kongming Empower", () => {
  it("cannot empower without three charge counters and South currents", () => {
    const starter = lineageTestChampion("Kongming", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion: starter, zones: { field: [bairuiResplendentBarrier] } },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const before = game.state;
    expect(() =>
      game.player("player-one").activateAbility(bairuiResplendentBarrier, "sqGcyYocLW-a2"),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
