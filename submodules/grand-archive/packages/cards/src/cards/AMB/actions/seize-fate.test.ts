import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { seizeFate } from "./seize-fate.ts";

function jinChampion(enabled: boolean) {
  const champion = createClassBonusTestChampion(seizeFate, true, "activation-discount");
  const face =
    champion.layout.kind === "single-faced" ? champion.layout.face : champion.layout.defaultFace;
  const canonicalId = `${champion.canonicalId}-jin-${enabled ? "yes" : "no"}`;
  return {
    ...champion,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        lineageName: enabled ? "Jin" : "NotJin",
      },
    },
  };
}

function payment(game: GrandArchiveTestEngine, count: number) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, count)
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers l61ubi93jx-a1 */
describe("Seize Fate — Jin Bonus activation discount", () => {
  it("costs four with a Jin champion and six otherwise", () => {
    for (const jin of [false, true]) {
      const champion = jinChampion(jin);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [seizeFate, ...Array.from({ length: 6 }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const cost = jin ? 4 : 6;
      const before = game.state;
      expect(() =>
        player.activate(seizeFate, { reservePayment: payment(game, cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(seizeFate, { reservePayment: payment(game, cost) });
    }
  });
});

/** @covers l61ubi93jx-a2 */
describe("Seize Fate — invert damage then banish at zero", () => {
  it("removes damage instead of taking it and banishes the champion at zero", () => {
    const champion = jinChampion(true);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [seizeFate, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener, automatedGardener, woodlandSquirrels],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(champion, { zone: "field" });
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    opponent.pass();
    advanceToMain(game, player.id);
    player.activate(seizeFate, { reservePayment: payment(game, 4) });
    passEffectsStack(game);
    advanceToMain(game, opponent.id);
    opponent.declareAttack(opponent.card(woodlandSquirrels, { zone: "field" }), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.zone).toBe("field");
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    const beforeSecond = game.state.objects[target.objectId]!.damage;
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[1]!, target);
    game.resolveCombatWithoutRetaliation();
    const afterSecond = game.state.objects[target.objectId];
    expect(
      afterSecond?.zone === "banishment" || (afterSecond?.damage ?? 99) < beforeSecond + 2,
    ).toBe(true);
  });
});
