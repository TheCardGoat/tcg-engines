import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceToMain,
  advanceCombatToTrigger,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { describe, expect, it } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { arimaGaiasWings } from "./arima-gaias-wings.ts";

/** @covers 075L8pLihO-a1 */
describe("Arima, Gaia's Wings \u2014 075L8pLihO-a1", () => {
  provePrideAlly({ card: arimaGaiasWings, pride: 5, power: 3 });
});

/** @covers 075L8pLihO-a2 */
describe("Arima's recollection buff counters", () => {
  it("gains three counters each controller recollection and none on the opposing turn", () => {
    const champion = lineageTestChampion("Arima fixture", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [arimaGaiasWings],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const id = p.card(arimaGaiasWings).objectId;
    for (const expected of [3, 6]) {
      advanceToMain(game, q.id);
      expect(game.state.objects[id]!.counters.buff ?? 0).toBe(expected - 3);
      advanceToMain(game, p.id);
      expect(game.state.objects[id]!.counters.buff).toBe(expected);
    }
  });
});

/** @covers 075L8pLihO-a3 */
describe("Arima's death", () => {
  it("returns only the dead Arima to its owner's memory after the death trigger resolves", () => {
    const champion = lineageTestChampion("Arima fixture", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [arimaGaiasWings] } },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      arima = p.card(arimaGaiasWings);
    for (const [i, attacker] of q.cards(woodlandSquirrels, { zone: "field" }).entries()) {
      q.declareAttack(attacker, arima);
      if (i < 2) game.resolveCombatWithoutRetaliation();
      else advanceCombatToTrigger(game, "075L8pLihO-a3");
      expect(p.zone("memory")).toHaveLength(0);
    }
    expect(p.cards(arimaGaiasWings, { zone: "graveyard" })).toHaveLength(1);
    passEffectsStack(game);
    expect(p.cards(arimaGaiasWings, { zone: "memory" })).toHaveLength(1);
    expect(q.zone("memory")).toHaveLength(0);
  });
});
