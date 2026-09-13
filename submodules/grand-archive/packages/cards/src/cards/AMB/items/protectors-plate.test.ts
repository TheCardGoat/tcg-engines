import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { protectorsPlate } from "./protectors-plate.ts";

/** @covers i1j4gvwbjo-a1 */
describe("Protector's Plate — Ally Link", () => {
  proveIntrinsicLink({
    card: protectorsPlate,
    host: woodlandSquirrels,
    invalidHost: trainingSword,
  });
});

/** @covers i1j4gvwbjo-a2 */
describe("Protector's Plate — linked life and intercept", () => {
  it("gives the linked ally +1 LIFE and intercept", () => {
    const champion = createClassBonusTestChampion(protectorsPlate, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "material-deck": [protectorsPlate],
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
    const lifeOf = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[host.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    expect(lifeOf()).toBe(1);
    player.materialize(protectorsPlate, {
      targets: { "intrinsic-link-target": [host.objectId] },
    });
    passEffectsStack(game);
    expect(lifeOf()).toBe(2);
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
    opponent.declareAttack(woodlandSquirrels, player.card(champion));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.combat?.targetIds).toEqual([host.objectId]);
  });
});
