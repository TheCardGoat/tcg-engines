import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { oasisTradingPost } from "./oasis-trading-post.ts";

const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf];

function fixture() {
  const champion = lineageTestChampion("Oasis", 0);
  const game = GrandArchiveTestEngine.startFixture({
    randomSeed: 1,
    definitions: [...herbs, automatonDrone],
    playerOne: {
      champion,
      zones: {
        field: [oasisTradingPost],
        hand: Array.from({ length: 5 }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels, reposition, woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  return game;
}

function payment(game: GrandArchiveTestEngine, amount: number) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, amount)
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers uy4xippor7-a1 */
describe("Oasis Trading Post — Glimpse 2", () => {
  it("pays three, rests before resolution, and applies the chosen top/bottom order", () => {
    const game = fixture();
    const player = game.player("player-one");
    const source = player.card(oasisTradingPost, { zone: "field" });
    const deck = player.zone("main-deck");
    const before = game.state;
    expect(() =>
      player.activateAbility(oasisTradingPost, "uy4xippor7-a1", {
        reservePayment: payment(game, 2),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activateAbility(oasisTradingPost, "uy4xippor7-a1", {
      reservePayment: payment(game, 3),
    });
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    const afterPayment = game.state;
    expect(() =>
      player.activateAbility(oasisTradingPost, "uy4xippor7-a2", {
        reservePayment: payment(game, 2),
      }),
    ).toThrow();
    expect(game.state).toEqual(afterPayment);
    passEffectsStack(game);
    const decision = game.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse choice");
    expect(decision.cardIds).toEqual(deck.slice(0, 2).map((card) => card.objectId));
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: [deck[1]!.objectId],
      bottom: [deck[0]!.objectId],
    } satisfies GrandArchiveGlimpseAnswer);
    passEffectsStack(game);
    expect(player.zone("main-deck")).toEqual([deck[1]!, deck[2]!, deck[0]!]);
  });
});

/** @covers uy4xippor7-a2 */
describe("Oasis Trading Post — Gather", () => {
  it("pays four and gathers exactly one awake Herb for its controller", () => {
    const game = fixture();
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(oasisTradingPost, "uy4xippor7-a2", {
        reservePayment: payment(game, 3),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activateAbility(oasisTradingPost, "uy4xippor7-a2", {
      reservePayment: payment(game, 4),
    });
    expect(
      player.zone("field").filter((card) => game.state.objects[card.objectId]!.isToken),
    ).toHaveLength(0);
    passEffectsStack(game);
    const tokens = player
      .zone("field")
      .filter((card) => game.state.objects[card.objectId]!.isToken);
    expect(tokens).toHaveLength(1);
    expect(herbs.map((herb) => herb.canonicalId)).toContain(tokens[0]!.definitionId);
    expect(game.state.objects[tokens[0]!.objectId]!.states.has("rested")).toBe(false);
  });
});

/** @covers uy4xippor7-a3 */
describe("Oasis Trading Post — Automaton Drone", () => {
  it("pays five and summons one awake Automaton Drone for its controller", () => {
    const game = fixture();
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(oasisTradingPost, "uy4xippor7-a3", {
        reservePayment: payment(game, 4),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activateAbility(oasisTradingPost, "uy4xippor7-a3", {
      reservePayment: payment(game, 5),
    });
    expect(player.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    const token = player.card(automatonDrone, { zone: "field" });
    expect(game.state.objects[token.objectId]!.isToken).toBe(true);
    expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
    expect(game.player("player-two").cards(automatonDrone, { zone: "field" })).toHaveLength(0);
  });
});
