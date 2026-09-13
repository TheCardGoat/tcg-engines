import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { bombasticSprint } from "../actions/bombastic-sprint.ts";
import { reposition } from "../actions/reposition.ts";
import { tetherInFlames } from "../actions/tether-in-flames.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { polkhawkBombasticShot } from "./polkhawk-bombastic-shot.ts";

function fixture(
  zones: Parameters<typeof GrandArchiveTestEngine.startFixture>[0]["playerOne"]["zones"],
) {
  const starter = lineageTestChampion("Polkhawk", 0);
  const opponent = lineageTestChampion("Opponent", 0);
  return {
    game: GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Polkhawk", 1)],
        zones: {
          ...zones,
          "material-deck": [polkhawkBombasticShot],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: opponent,
        zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    }),
    starter,
    opponent,
  };
}

function materializeAndReachMain(game: GrandArchiveTestEngine): void {
  const player = game.player("player-one");
  player.materialize(polkhawkBombasticShot);
  player.pass();
  game.player("player-two").pass();
  passEffectsStack(game);
  for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}

/** @covers ryvfq3huqj-a1 */
describe("Polkhawk, Bombastic Shot — Ranged 2", () => {
  it("adds two power to the distant champion's attack", () => {
    const { game, starter, opponent } = fixture({
      hand: [reposition, woodlandSquirrels],
      field: [aurousteelGreatsword],
    });
    materializeAndReachMain(game);
    const player = game.player("player-one");
    const champion = player.card(starter);
    const target = game.player("player-two").card(opponent);
    player.activate(reposition, {
      targets: { "target-1": [champion.objectId] },
      reservePayment: [
        {
          kind: "card",
          cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ],
    });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");
    player.declareAttack(champion, target, {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
  });
});

/** @covers ryvfq3huqj-a2 */
describe("Polkhawk, Bombastic Shot — Ranger Reaction discount", () => {
  it("discounts Ranger Reactions but not another class's Reaction", () => {
    const { game } = fixture({
      hand: [bombasticSprint, tetherInFlames, woodlandSquirrels, woodlandSquirrels],
    });
    materializeAndReachMain(game);
    const player = game.player("player-one");
    const payments = player
      .cards(woodlandSquirrels)
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    player.activate(bombasticSprint, { reservePayment: payments.slice(0, 1) });
    expect(() => player.activate(tetherInFlames, { reservePayment: payments })).toThrow();
  });
});
