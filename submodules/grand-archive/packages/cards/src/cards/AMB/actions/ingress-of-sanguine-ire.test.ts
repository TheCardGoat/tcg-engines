import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { ingressOfSanguineIre } from "./ingress-of-sanguine-ire.ts";

function durableChampion() {
  const base = createClassBonusTestChampion(ingressOfSanguineIre, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 40 } },
    },
  };
}

function advanceToOpponentEnd(game: GrandArchiveTestEngine) {
  for (let step = 0; step < 128; step++) {
    const wait = game.waitState();
    if (
      game.state.turn.playerId === "player-two" &&
      game.state.turn.phase === "end" &&
      wait.kind === "opportunity" &&
      wait.playerId === "player-one"
    )
      return;
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach the opponent end phase");
}

function advanceToOwnMain(game: GrandArchiveTestEngine) {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === "player-one" && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach own main phase");
}

/** @covers dfchplzf6m-a1 */
describe("Ingress of Sanguine Ire — opponent end-phase only", () => {
  it("rejects activation during own main and allows it on the opponent's end phase", () => {
    const champion = durableChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [ingressOfSanguineIre, woodlandSquirrels, woodlandSquirrels],
          field: [trainingSword],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    game.player("player-two").pass();
    const before = game.state;
    expect(() => player.activate(ingressOfSanguineIre, { reservePayment: payment })).toThrow();
    expect(game.state).toEqual(before);
    player.pass();
    advanceToOpponentEnd(game);
    player.activate(ingressOfSanguineIre, { reservePayment: payment });
    expect(game.state.stack).toHaveLength(1);
  });
});

/** @covers dfchplzf6m-a2 */
describe("Ingress of Sanguine Ire — next-turn attack and undamaged draw", () => {
  it("gives +3 to the first champion attack next turn and draws two if undamaged", () => {
    for (const damaged of [false, true]) {
      const champion = durableChampion();
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [ingressOfSanguineIre, woodlandSquirrels, woodlandSquirrels],
            field: [trainingSword],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: damaged ? [ferventBeastmaster] : [],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      if (damaged) {
        opponent.declareAttack(ferventBeastmaster, player.card(champion, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
      }
      advanceToOpponentEnd(game);
      const deck = player.zone("main-deck");
      player.activate(ingressOfSanguineIre, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(damaged ? 2 : 4);
      if (!damaged) {
        expect(player.zone("memory")).toContainEqual(deck[0]);
        expect(player.zone("memory")).toContainEqual(deck[1]);
      }
      advanceToOwnMain(game);
      const defender = opponent.card(champion, { zone: "field" });
      player.declareAttack(player.card(champion, { zone: "field" }), defender, {
        weaponIds: [player.card(trainingSword, { zone: "field" }).objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[defender.objectId]!.damage).toBe(4);
    }
  });
});
