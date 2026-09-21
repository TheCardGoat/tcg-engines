import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { tempestSilverback } from "../../DOA/allies/tempest-silverback.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { utherIllustriousKing } from "./uther-illustrious-king.ts";

/** @covers 5h8asbierp-a1 */
describe("Uther, Illustrious King — Intercept and Vigor", () => {
  it("redirects an attack from its champion to itself", () => {
    const champion = createClassBonusTestChampion(
      utherIllustriousKing,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [utherIllustriousKing] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const defender = game.player("player-one");
    const attacker = game.player("player-two");
    const uther = defender.card(utherIllustriousKing);
    attacker.declareAttack(automatedGardener, defender.card(champion));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.combat?.targetIds).toEqual([uther.objectId]);
  });

  it("wakes at the beginning of its controller's end phase", () => {
    const champion = createClassBonusTestChampion(
      utherIllustriousKing,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [utherIllustriousKing],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const uther = player.card(utherIllustriousKing);
    player.declareAttack(uther, game.player("player-two").card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[uther.objectId]!.states.has("rested")).toBe(true);
    for (let step = 0; game.state.turn.phase !== "end" && step < 64; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    passEffectsStack(game);
    expect(game.state.objects[uther.objectId]!.states.has("rested")).toBe(false);
  });
});

/** @covers 5h8asbierp-a2 @covers 5h8asbierp-a3 */
describe("Uther, Illustrious King — banished-object custody", () => {
  it("rests to banish another object, then returns that exact object rested on leave", () => {
    const champion = createClassBonusTestChampion(
      utherIllustriousKing,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            utherIllustriousKing,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, ferventBeastmaster, tempestSilverback],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const uther = player.card(utherIllustriousKing, { zone: "hand" });
    const exiled = opponent.card(woodlandSquirrels, { zone: "field" });
    player.activate(uther, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [exiled.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[uther.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[exiled.objectId]!.zone).toBe("banishment");

    advanceToMain(game, opponent.id);
    opponent.declareAttack(ferventBeastmaster, uther);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[uther.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[exiled.objectId]).toMatchObject({ zone: "field" });
    expect(game.state.objects[exiled.objectId]!.states.has("rested")).toBe(true);
  });
});
