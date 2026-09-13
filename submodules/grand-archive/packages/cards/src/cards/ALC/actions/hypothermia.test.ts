import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { hypothermia } from "./hypothermia.ts";

/** @covers cyfrzrplyw-a1 */
describe("Hypothermia — rested ally life reduction", () => {
  it("reduces only a rested ally's life by four on resolution until turn end", () => {
    const champion = createClassBonusTestChampion(hypothermia, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [giantTortoise, woodlandSquirrels, potionOfHealing],
          hand: [hypothermia, giantTortoise, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(giantTortoise, { zone: "field" });
    const opponentChampion = opponent.card(champion);
    const life = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    player.declareAttack(target, opponentChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    expect(life()).toBe(6);
    const paymentCards = player.cards(woodlandSquirrels, { zone: "hand" });
    const payment = paymentCards.map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(woodlandSquirrels, { zone: "field" }),
      player.card(champion),
      player.card(potionOfHealing),
      player.card(giantTortoise, { zone: "hand" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(hypothermia, {
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    const before = game.state;
    expect(() =>
      player.activate(hypothermia, {
        reservePayment: payment.slice(0, 1),
        targets: { "target-1": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(hypothermia, {
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    expect(life()).toBe(6);
    expect(player.zone("memory")).toEqual(paymentCards);
    passEffectsStack(game);
    expect(life()).toBe(2);
    const turn = game.state.turn.number;
    for (let step = 0; game.state.turn.number === turn && step < 64; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(game.state.turn.number).toBe(turn + 1);
    expect(life()).toBe(6);
  });
});
