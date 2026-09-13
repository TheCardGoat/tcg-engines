import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { galvanizingGale } from "./galvanizing-gale.ts";
import { cyclicalBreeze } from "./cyclical-breeze.ts";

/** @covers 3cmrkv3y16-a1 */
describe("Cyclical Breeze — Class Bonus activation discount", () => {
  for (const classBonus of [true, false]) {
    it(`${classBonus ? "costs 2" : "costs 4"} when Class Bonus is ${classBonus ? "on" : "off"}`, () => {
      const cost = classBonus ? 2 : 4;
      const champion = createClassBonusTestChampion(
        cyclicalBreeze,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [cyclicalBreeze, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            graveyard: [galvanizingGale],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const target = player.card(galvanizingGale, { zone: "graveyard" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(cyclicalBreeze, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-card": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(cyclicalBreeze, {
        reservePayment: payment,
        targets: { "target-card": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 3cmrkv3y16-a2 */
describe("Cyclical Breeze — return a wind Spell", () => {
  it("returns a controlled wind Spell from the graveyard and rejects other cards", () => {
    const champion = createClassBonusTestChampion(cyclicalBreeze, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [cyclicalBreeze, woodlandSquirrels, woodlandSquirrels],
          graveyard: [galvanizingGale, fireball, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { graveyard: [galvanizingGale] } },
    });
    const player = game.player("player-one");
    const returned = player.card(galvanizingGale, { zone: "graveyard" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(fireball, { zone: "graveyard" }),
      player.card(woodlandSquirrels, { zone: "graveyard" }),
      game.player("player-two").card(galvanizingGale, { zone: "graveyard" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(cyclicalBreeze, {
          reservePayment: payment,
          targets: { "target-card": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(cyclicalBreeze, {
      reservePayment: payment,
      targets: { "target-card": [returned.objectId] },
    });
    expect(game.state.objects[returned.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[returned.objectId]!.zone).toBe("hand");
  });
});
