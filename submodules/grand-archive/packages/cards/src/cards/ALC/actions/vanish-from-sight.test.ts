import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vanishFromSight } from "./vanish-from-sight.ts";

function fixture(firstPlayer: "playerOne" | "playerTwo" = "playerOne") {
  const champion = lineageTestChampion("Vanish", 0);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer,
    playerOne: {
      champion,
      zones: {
        hand: [vanishFromSight, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, champion };
}

function advanceToLaterMain(
  game: GrandArchiveTestEngine,
  playerId: string,
  afterTurn: number,
): void {
  for (let step = 0; step < 192; step++) {
    if (
      game.state.turn.number > afterTurn &&
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach the requested main phase");
}

/** @covers vm5kt3q2sv-a1 */
describe("Vanish from Sight — opponent recollection restriction", () => {
  it("rejects activation during its controller's main phase", () => {
    const { game } = fixture();
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(vanishFromSight, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("rejects activation during an opponent's main phase", () => {
    const { game } = fixture("playerTwo");
    const player = game.player("player-one");
    game.player("player-two").pass();
    const before = game.state;
    expect(() =>
      player.activate(vanishFromSight, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers vm5kt3q2sv-a2 */
describe("Vanish from Sight — temporary champion Stealth", () => {
  it("activates during an opponent's recollection and expires at that turn's end", () => {
    const { game, champion } = fixture();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    advanceToRecollection(game, opponent.id);
    opponent.pass();
    player.activate(vanishFromSight, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const protectedChampion = player.card(champion, { zone: "field" });
    const attacker = opponent.card(woodlandSquirrels, { zone: "field" });
    for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const whileStealthed = game.state;
    expect(() => opponent.declareAttack(attacker, protectedChampion)).toThrow();
    expect(game.state).toEqual(whileStealthed);

    const protectedTurn = game.state.turn.number;
    advanceToLaterMain(game, opponent.id, protectedTurn);
    opponent.declareAttack(attacker, protectedChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[protectedChampion.objectId]!.damage).toBe(1);
  });
});
