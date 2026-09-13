import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { phantomVeil } from "./phantom-veil.ts";

/** @covers fviga4cmti-a1 */
describe("Phantom Veil — Ally Link", () => {
  proveIntrinsicLink({
    card: phantomVeil,
    host: woodlandSquirrels,
    invalidHost: trainingSword,
  });
});

/** @covers fviga4cmti-a2 */
describe("Phantom Veil — linked stealth", () => {
  it("pays two so the linked ally gains stealth until end of turn", () => {
    const champion = createClassBonusTestChampion(phantomVeil, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels],
          memory: [woodlandSquirrels],
          "material-deck": [phantomVeil],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const host = player.card(woodlandSquirrels, { zone: "field" });
    player.materialize(phantomVeil, {
      targets: { "intrinsic-link-target": [host.objectId] },
    });
    passEffectsStack(game);
    for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const veil = player.card(phantomVeil, { zone: "field" });
    for (
      let step = 0;
      step < 80 && !(game.state.turn.playerId === opponent.id && game.state.turn.phase === "main");
      step++
    ) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activateAbility(veil, "fviga4cmti-a2", {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    const before = game.state;
    expect(() => opponent.declareAttack(woodlandSquirrels, host)).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(woodlandSquirrels, player.card(champion));
    expect(game.state.combat?.targetIds).toEqual([player.card(champion).objectId]);
  });
});
