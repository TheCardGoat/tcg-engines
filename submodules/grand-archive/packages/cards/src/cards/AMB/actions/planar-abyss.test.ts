import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import {
  advanceToMain,
  advanceToRecollection,
  changeShiftingCurrents,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { planarAbyss } from "./planar-abyss.ts";

/** @covers qexcwmx2ug-a1 */
describe("Planar Abyss — Class Bonus Efficiency", () => {
  it("reduces the reserve cost by champion level only while Class Bonus is enabled", () => {
    for (const classBonus of [false, true] as const) {
      const { starter, lineage } = classBonusLeveledChampion(planarAbyss, classBonus, 2);
      const printed = 12;
      const cost = classBonus ? printed - 2 : printed;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage,
          zones: {
            hand: [planarAbyss, ...Array.from({ length: printed }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      const before = game.state;
      expect(() =>
        player.activate(planarAbyss, {
          reservePayment: payment.slice(0, cost - 1).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(planarAbyss, {
        reservePayment: payment.slice(0, cost).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      expect(player.zone("memory")).toHaveLength(cost);
    }
  });
});

/** @covers qexcwmx2ug-a2 */
describe("Planar Abyss — next recollection destroy and South damage", () => {
  it("destroys non-champions and deals 10 to the opposing champion only while facing South", () => {
    const game = startWithShiftingCurrentsNorth({
      playerOneZones: {
        field: [automatedGardener],
        hand: [planarAbyss, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
        "material-deck": [],
      },
      playerTwoZones: { field: [automatedGardener] },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    changeShiftingCurrents(game, "south");
    advanceToMain(game, player.id);
    const ownAlly = player.card(automatedGardener, { zone: "field" });
    const foeAlly = opponent.card(automatedGardener, { zone: "field" });
    const foe = opponent.zone("field").find((ref) => ref.objectId !== foeAlly.objectId)!;
    const own = player.zone("field").find((ref) => ref.objectId !== ownAlly.objectId)!;
    player.activate(planarAbyss, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 12)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ownAlly.objectId]!.zone).toBe("field");
    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(game.state.objects[ownAlly.objectId]!.zone).not.toBe("field");
    expect(game.state.objects[foeAlly.objectId]!.zone).not.toBe("field");
    expect(game.state.objects[own.objectId]!.zone).toBe("field");
    expect(game.state.objects[foe.objectId]!.damage).toBe(10);
    expect(game.state.objects[own.objectId]!.damage).toBe(0);
  });
});
