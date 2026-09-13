import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { firebloodedOath } from "./fireblooded-oath.ts";

function fixture(classBonus: boolean, fireCards = 3) {
  const champion = createClassBonusTestChampion(firebloodedOath, classBonus, "activation-discount");
  const successor = lineageTestChampion("Test Champion", 1);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [firebloodedOath, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
        graveyard: [...Array.from({ length: fireCards }, () => firebloodedOath), woodlandSquirrels],
        "material-deck": [successor],
      },
    },
    playerTwo: { champion: lineageTestChampion("Opponent", 0) },
  });
  return { game, champion, successor };
}

function activationOptions(game: GrandArchiveTestEngine, reserve: number) {
  const player = game.player("player-one");
  return {
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, reserve)
      .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    costSelections: [
      player
        .cards(firebloodedOath, { zone: "graveyard" })
        .slice(0, 3)
        .map((card) => card.objectId),
    ],
  };
}

/** @covers bmoqk2c7wk-a1 */
describe("Fireblooded Oath — Class Bonus discount", () => {
  for (const classBonus of [false, true]) {
    it(`requires exactly ${classBonus ? 3 : 5} reserve with Class Bonus ${classBonus}`, () => {
      const cost = classBonus ? 3 : 5;
      const { game } = fixture(classBonus);
      const player = game.player("player-one");
      const before = game.state;
      expect(() => player.activate(firebloodedOath, activationOptions(game, cost - 1))).toThrow();
      expect(game.state).toEqual(before);
      player.activate(firebloodedOath, activationOptions(game, cost));
    });
  }
});

/** @covers bmoqk2c7wk-a2 */
describe("Fireblooded Oath — additional fire-card cost", () => {
  it("banishes exactly three fire cards from its controller's graveyard before resolution", () => {
    const { game } = fixture(true);
    const player = game.player("player-one");
    const fireCards = player.cards(firebloodedOath, { zone: "graveyard" });
    player.activate(firebloodedOath, activationOptions(game, 3));
    expect(player.cards(firebloodedOath, { zone: "banishment" })).toEqual(fireCards);
    expect(player.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
    expect(game.state.stack).toHaveLength(1);
  });

  it("rejects fewer than three eligible fire cards atomically", () => {
    const { game } = fixture(true, 2);
    const player = game.player("player-one");
    const before = game.state;
    expect(() => player.activate(firebloodedOath, activationOptions(game, 3))).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers bmoqk2c7wk-a3 */
describe("Fireblooded Oath — temporary level", () => {
  it("levels on resolution and delevels at the beginning of the next end phase", () => {
    const { game, champion, successor } = fixture(true);
    const player = game.player("player-one");
    const championRef = player.card(champion, { zone: "field" });
    player.activate(firebloodedOath, activationOptions(game, 3));
    passEffectsStack(game);
    expect(game.state.objects[championRef.objectId]!.activeDefinitionId).toBe(
      successor.canonicalId,
    );
    expect(player.cards(successor, { zone: "inner-lineage" })).toHaveLength(1);

    for (let step = 0; step < 64; step++) {
      if (game.state.stack.some((item) => item.kind === "triggered-ability")) break;
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("end");
    expect(game.state.objects[championRef.objectId]!.activeDefinitionId).toBe(
      successor.canonicalId,
    );
    passEffectsStack(game);
    expect(game.state.objects[championRef.objectId]!.activeDefinitionId).toBe(champion.canonicalId);
    expect(player.cards(successor, { zone: "material-deck" })).toHaveLength(1);
  });
});
