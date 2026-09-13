import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { cavalierRescue } from "./cavalier-rescue.ts";

function setup(horse: boolean) {
  const champion = createClassBonusTestChampion(cavalierRescue, false, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [cavalierRescue, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        field: horse ? [galesMare, woodlandSquirrels] : [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [ferventBeastmaster] } },
  });
}

/** @covers 75uhspxqme-a1 */
describe("Cavalier Rescue — Equestrian discount", () => {
  for (const horse of [false, true]) {
    it(`${horse ? "costs 1" : "costs 3"} when a Horse ally ${horse ? "is" : "is not"} controlled`, () => {
      const cost = horse ? 1 : 3;
      const game = setup(horse);
      const player = game.player("player-one");
      game.player("player-two").pass();
      const target = player.card(woodlandSquirrels, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(cavalierRescue, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(cavalierRescue, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 75uhspxqme-a2 */
describe("Cavalier Rescue — +3 LIFE and wake a defender", () => {
  it("lets a 1-life ally survive 3 damage and wakes it while defending", () => {
    const champion = createClassBonusTestChampion(cavalierRescue, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [cavalierRescue, woodlandSquirrels],
          field: [galesMare, woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [ferventBeastmaster],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    player.declareAttack(ally, opponent.card(champion, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    for (let step = 0; step < 64; step++) {
      if (game.state.turn.playerId === "player-two" && game.state.turn.phase === "main") break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
    opponent.declareAttack(ferventBeastmaster, ally);
    opponent.pass();
    player.activate(cavalierRescue, {
      reservePayment: [
        {
          kind: "card",
          cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ],
      targets: { "target-1": [ally.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(false);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ally.objectId]!.zone).toBe("field");
    expect(game.state.objects[ally.objectId]!.damage).toBe(3);
  });
});
