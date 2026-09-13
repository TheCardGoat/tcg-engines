import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { shieldOfParvati } from "./shield-of-parvati.ts";

/** @covers labt8hvoww-a1 */
describe("Shield of Parvati — Ally Link", () => {
  proveIntrinsicLink({
    card: shieldOfParvati,
    host: woodlandSquirrels,
    invalidHost: trainingSword,
  });
});

/** @covers labt8hvoww-a2 */
describe("Shield of Parvati — prevent 2 and sacrifice", () => {
  it("prevents 2 damage from the linked ally and sacrifices itself", () => {
    const champion = createClassBonusTestChampion(shieldOfParvati, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "material-deck": [shieldOfParvati],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const host = player.card(woodlandSquirrels, { zone: "field" });
    player.materialize(shieldOfParvati, {
      targets: { "intrinsic-link-target": [host.objectId] },
    });
    passEffectsStack(game);
    const shield = player.card(shieldOfParvati, { zone: "field" });
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
    opponent.declareAttack(automatedGardener, host);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[host.objectId]!.damage).toBe(0);
    expect(game.state.objects[shield.objectId]!.zone).not.toBe("field");
    expect(game.state.objects[host.objectId]!.zone).toBe("field");
  });
});
