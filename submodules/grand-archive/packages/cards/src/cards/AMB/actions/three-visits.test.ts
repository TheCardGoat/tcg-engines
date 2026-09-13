import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { threeVisits } from "./three-visits.ts";

function fixture(classBonus: boolean, zone: "hand" | "graveyard" | "banishment" = "hand") {
  const champion = createClassBonusTestChampion(threeVisits, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        [zone]: [threeVisits],
        "main-deck": [woodlandSquirrels, reposition, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: { field: [woodlandSquirrels] },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  opponent.declareAttack(
    opponent.card(woodlandSquirrels, { zone: "field" }),
    player.card(champion, { zone: "field" }),
  );
  game.resolveCombatWithoutRetaliation();
  opponent.pass();
  return { game, champion };
}

function activateFrom(game: GrandArchiveTestEngine, zone: "hand" | "graveyard" | "banishment") {
  const player = game.player("player-one");
  const card = player.card(threeVisits, { zone });
  return player.execute({ move: "activate-card", cardId: card.objectId });
}

function finishGlimpseAndRecover(game: GrandArchiveTestEngine) {
  passEffectsStack(game);
  const glimpse = game.state.decision;
  if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 2");
  answerDecision(game, "resolve-glimpse", {
    kind: "reorder",
    top: glimpse.cardIds,
    bottom: [],
  } satisfies GrandArchiveGlimpseAnswer);
  passEffectsStack(game);
}

/** @covers w7o3agvvnc-a1 */
describe("Three Visits — rest champion additional cost", () => {
  it("rejects activation unless the champion can rest", () => {
    const champion = createClassBonusTestChampion(threeVisits, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [threeVisits, threeVisits],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const first = player.cards(threeVisits, { zone: "hand" })[0]!;
    player.execute({ move: "activate-card", cardId: first.objectId });
    finishGlimpseAndRecover(game);
    expect(
      game.state.objects[player.card(champion, { zone: "field" }).objectId]!.states.has("rested"),
    ).toBe(true);
    const before = game.state;
    const second = player.cards(threeVisits, { zone: "hand" })[0]!;
    expect(() => player.execute({ move: "activate-card", cardId: second.objectId })).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers w7o3agvvnc-a4 */
describe("Three Visits — Glimpse 2 and recover 2", () => {
  it("glimpses two and recovers two after resting the champion", () => {
    const { game, champion } = fixture(false);
    const player = game.player("player-one");
    const target = player.card(champion, { zone: "field" });
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    const deck = player.zone("main-deck");
    player.activate(threeVisits);
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    finishGlimpseAndRecover(game);
    expect(player.zone("main-deck")).toEqual(deck);
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
  });
});

/** @covers w7o3agvvnc-a2 */
describe("Three Visits — Class Bonus graveyard activation", () => {
  it("may activate from the graveyard and banishes as it resolves only with Class Bonus", () => {
    const disabled = fixture(false, "graveyard");
    const before = disabled.game.state;
    expect(() => activateFrom(disabled.game, "graveyard")).toThrow();
    expect(disabled.game.state).toEqual(before);

    const { game, champion } = fixture(true, "graveyard");
    const player = game.player("player-one");
    activateFrom(game, "graveyard");
    finishGlimpseAndRecover(game);
    expect(player.cards(threeVisits, { zone: "banishment" })).toHaveLength(1);
    expect(game.state.objects[player.card(champion, { zone: "field" }).objectId]!.damage).toBe(0);
  });
});

/** @covers w7o3agvvnc-a3 */
describe("Three Visits — Class Bonus banishment activation", () => {
  it("may activate from banishment and puts the card on the bottom of the deck", () => {
    const disabled = fixture(false, "banishment");
    const before = disabled.game.state;
    expect(() => activateFrom(disabled.game, "banishment")).toThrow();
    expect(disabled.game.state).toEqual(before);

    const { game } = fixture(true, "banishment");
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    activateFrom(game, "banishment");
    finishGlimpseAndRecover(game);
    expect(player.zone("main-deck").at(-1)?.definitionId).toBe(threeVisits.canonicalId);
    expect(player.zone("main-deck").slice(0, -1)).toEqual(deck);
  });
});
