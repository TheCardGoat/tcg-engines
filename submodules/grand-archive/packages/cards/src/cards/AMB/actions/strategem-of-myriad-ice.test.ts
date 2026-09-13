import { describe, expect, it } from "vitest";

import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import {
  advanceToMain,
  changeShiftingCurrents,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ordinaryHorse } from "../allies/ordinary-horse.ts";
import { strategemOfMyriadIce } from "./strategem-of-myriad-ice.ts";

function kongmingLevel(level: number) {
  const champion = lineageTestChampion("Kongming", level);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: ["NORM", "WATER", "WIND", "TERA", "FIRE", "LUXEM", "EXIA"] as const,
      },
    },
  };
}

/** @covers id0ybub247-a1 */
describe("Strategem of Myriad Ice — East Efficiency", () => {
  it("costs 6 facing North and 5 facing East at Kongming level 1", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [kongmingLevel(1)],
      playerOneZones: {
        hand: [strategemOfMyriadIce, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
      },
    });
    const player = game.player("player-one");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" });
    const before = game.state;
    expect(() =>
      player.activate(strategemOfMyriadIce, {
        reservePayment: payment.slice(0, 5).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    changeShiftingCurrents(game, "east");
    expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("east");
    advanceToMain(game, player.id);
    player.activate(strategemOfMyriadIce, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 5)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(player.zone("memory")).toHaveLength(5);
  });
});

/** @covers id0ybub247-a2 */
describe("Strategem of Myriad Ice — banish Floating Memory to damage", () => {
  it("deals 3 per banished Floating Memory card and rejects a controlled target", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [kongmingLevel(1)],
      playerOneZones: {
        hand: [strategemOfMyriadIce, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
        graveyard: [ordinaryHorse, ordinaryHorse],
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const foe = opponent.zone("field")[0]!;
    const ownChampion = player.zone("field")[0]!;
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    player.activate(strategemOfMyriadIce, { reservePayment: payment });
    passEffectsStack(game);
    const horses = player.cards(ordinaryHorse, { zone: "graveyard" });
    if (game.state.decision?.kind === "resolve-optional-effect") {
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
    }
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(
        game,
        "resolve-effect-choice",
        horses.map((card) => card.objectId),
      );
    }
    passEffectsStack(game);
    if (game.state.decision?.kind === "order-triggered-abilities") {
      answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
    }
    for (const _horse of horses) {
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      const beforeInvalid = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "damaged-unit": [ownChampion.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(beforeInvalid);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "damaged-unit": [foe.objectId] },
      });
    }
    passEffectsStack(game);
    expect(game.state.objects[foe.objectId]!.damage).toBe(6);
    expect(player.cards(ordinaryHorse, { zone: "banishment" })).toHaveLength(2);
  });
});
