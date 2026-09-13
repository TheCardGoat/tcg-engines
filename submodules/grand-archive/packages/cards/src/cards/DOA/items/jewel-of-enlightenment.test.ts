import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { jewelOfEnlightenment } from "./jewel-of-enlightenment.ts";
/** @covers AKA19OwaCh-a1 */
describe("Jewel of Enlightenment", () => {
  it("banishes as a cost, adds one counter on resolution, and cannot be reused", () => {
    const champion = lineageTestChampion("Jewel fixture", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [jewelOfEnlightenment] } },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      id = p.card(champion).objectId;
    p.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1");
    expect(p.cards(jewelOfEnlightenment, { zone: "banishment" })).toHaveLength(1);
    expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(0);
    expect(() => p.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1")).toThrow();
    passEffectsStack(game);
    expect(game.state.objects[id]!.counters.enlighten).toBe(1);
    expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten ?? 0).toBe(0);
  });
});
