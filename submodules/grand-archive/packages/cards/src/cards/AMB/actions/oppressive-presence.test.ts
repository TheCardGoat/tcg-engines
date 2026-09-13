import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { flashfireHorse } from "../allies/flashfire-horse.ts";
import { oppressivePresence } from "./oppressive-presence.ts";

function fixture(firstPlayer: "playerOne" | "playerTwo" = "playerOne") {
  const champion = createClassBonusTestChampion(oppressivePresence, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer,
    playerOne: {
      champion,
      zones: {
        hand: [oppressivePresence, woodlandSquirrels, woodlandSquirrels],
        field: [flashfireHorse],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [woodlandSquirrels],
        hand: [woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, champion };
}

function payment(game: GrandArchiveTestEngine) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers j9hjjvkyyr-a1 */
describe("Oppressive Presence — opponent recollection restriction", () => {
  it("rejects both players' main phases", () => {
    for (const firstPlayer of ["playerOne", "playerTwo"] as const) {
      const { game } = fixture(firstPlayer);
      if (firstPlayer === "playerTwo") game.player("player-two").pass();
      const before = game.state;
      expect(() =>
        game.player("player-one").activate(oppressivePresence, { reservePayment: payment(game) }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
  });
});

/** @covers j9hjjvkyyr-a2 */
describe("Oppressive Presence — ally attack tax", () => {
  it("makes ally attacks cost the highest fire ally power and leaves champion attacks free", () => {
    const { game, champion } = fixture();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    advanceToRecollection(game, opponent.id);
    opponent.pass();
    player.activate(oppressivePresence, { reservePayment: payment(game) });
    passEffectsStack(game);
    for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const attacker = opponent.card(woodlandSquirrels, { zone: "field" });
    const defender = player.card(champion, { zone: "field" });
    const before = game.state;
    expect(() => opponent.declareAttack(attacker, defender)).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(attacker, defender, {
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(1);
  });
});
