import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { startWithShiftingCurrentsNorth } from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { bairuiResplendentBarrier } from "../phantasias/bairui-resplendent-barrier.ts";
import { kongmingFelEidolon } from "./kongming-fel-eidolon.ts";

/** @covers 7x2v4tdop1-a1 */
describe("Kongming, Fel Eidolon — Lineage", () => {
  proveChampionLineage({
    card: kongmingFelEidolon,
    lineageName: "Kongming",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers 7x2v4tdop1-a2 */
describe("Kongming, Fel Eidolon — On Enter recover", () => {
  it("recovers equal to tera cards in banishment", () => {
    const starter = lineageTestChampion("Kongming", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Kongming", 1), lineageTestChampion("Kongming", 2)],
        zones: {
          "material-deck": [kongmingFelEidolon],
          memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          banishment: [bairuiResplendentBarrier, bairuiResplendentBarrier, woodlandSquirrels],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: {
          field: [automatedGardener, automatedGardener],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const champion = player.card(starter, { zone: "field" });
    const gardeners = opponent.cards(automatedGardener, { zone: "field" });
    opponent.declareAttack(gardeners[0]!, champion);
    game.resolveCombatWithoutRetaliation();
    opponent.declareAttack(gardeners[1]!, champion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[champion.objectId]!.damage).toBe(4);
    for (let step = 0; step < 64; step++) {
      if (game.state.turn.playerId === player.id && game.state.turn.phase === "materialize") break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    player.materialize(kongmingFelEidolon);
    player.pass();
    opponent.pass();
    expect(game.state.objects[champion.objectId]!.damage).toBe(4);
    passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.damage).toBe(2);
  });
});

/** @covers 7x2v4tdop1-a3 */
describe("Kongming, Fel Eidolon — Spell currents", () => {
  it("may change Shifting Currents to an adjacent direction after a Spell", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [
        lineageTestChampion("Kongming", 1),
        lineageTestChampion("Kongming", 2),
        kongmingFelEidolon,
      ],
      playerOneZones: {
        hand: [bairuiResplendentBarrier, woodlandSquirrels, woodlandSquirrels],
      },
    });
    const player = game.player("player-one");
    expect(game.state.players[player.id]?.states["shifting-currents"]).toBe("north");
    player.activate(bairuiResplendentBarrier, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-direction-choice")
      answerDecision(game, "resolve-direction-choice", "west");
    passEffectsStack(game);
    expect(game.state.players[player.id]?.states["shifting-currents"]).toBe("west");
  });
});
