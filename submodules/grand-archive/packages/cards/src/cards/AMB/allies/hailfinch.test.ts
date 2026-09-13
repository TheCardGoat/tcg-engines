import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { feedNourishment } from "../actions/feed-nourishment.ts";
import { hailfinch } from "./hailfinch.ts";

function passToMain(game: GrandArchiveTestEngine, playerId: string, afterTurn = 0): void {
  for (let step = 0; step < 64; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > afterTurn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach main");
}

/** @covers 3XV4QlQXfy-a1 */
describe("Hailfinch — attack declaration tax", () => {
  it("requires two reserve for each attack targeting Hailfinch", () => {
    const champion = createClassBonusTestChampion(hailfinch, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [hailfinch] } },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const opponent = game.player("player-two");
    const finch = game.player("player-one").card(hailfinch, { zone: "field" });
    const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
    const payments = opponent.cards(woodlandSquirrels, { zone: "hand" });
    const before = game.state;
    expect(() => opponent.declareAttack(attackers[0]!, finch)).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(attackers[0]!, finch, {
      reservePayment: payments
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[finch.objectId]!.damage).toBe(1);
    expect(opponent.zone("memory")).toHaveLength(2);

    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
      game.player(wait.playerId).pass();
    opponent.declareAttack(attackers[1]!, game.player("player-one").card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[game.player("player-one").card(champion).objectId]!.damage).toBe(1);
  });
});

/** @covers 3XV4QlQXfy-a2 */
describe("Hailfinch — Class Bonus On Hit rest and skip wake-up", () => {
  for (const classBonus of [false, true]) {
    for (const accept of [false, true]) {
      it(`Class Bonus=${classBonus}, remove buff=${accept}`, () => {
        const champion = createClassBonusTestChampion(hailfinch, classBonus, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [hailfinch],
              hand: [feedNourishment, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const finch = player.card(hailfinch, { zone: "field" });
        player.activate(feedNourishment, {
          targets: { "target-1": [finch.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[finch.objectId]!.counters.buff).toBe(1);
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(finch, target);
        if (!classBonus) {
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
          expect(game.state.objects[finch.objectId]!.counters.buff).toBe(1);
          return;
        }
        advanceCombatToTrigger(game, "3XV4QlQXfy-a2");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[finch.objectId]!.counters.buff ?? 0).toBe(accept ? 0 : 1);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(accept);
        if (!accept) return;
        const turn = game.state.turn.number;
        passToMain(game, opponent.id, turn);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      });
    }
  }
});
