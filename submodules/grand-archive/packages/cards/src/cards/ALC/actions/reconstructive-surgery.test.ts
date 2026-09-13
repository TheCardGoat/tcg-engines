import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { reconstructiveSurgery } from "./reconstructive-surgery.ts";

/** @covers z308kuz07n-a1 */
describe("Reconstructive Surgery — level-gated modes", () => {
  it("puts a buff counter on the targeted Automaton ally and rejects other objects", () => {
    const champion = createClassBonusTestChampion(
      reconstructiveSurgery,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [reconstructiveSurgery, automatedGardener, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(automatedGardener, { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(champion),
      player.card(giantTortoise, { zone: "field" }),
      player.card(automatedGardener, { zone: "hand" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(reconstructiveSurgery, {
          modeIds: ["mode-1"],
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(reconstructiveSurgery, {
      modeIds: ["mode-1"],
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
  });

  for (const level of [1, 2]) {
    it(`${level >= 2 ? "returns" : "rejects returning"} an Automaton at level ${level}`, () => {
      const champion = lineageTestChampion(`Surgery ${level}`, 0);
      const lineage = Array.from({ length: level }, (_, index) =>
        lineageTestChampion(`Surgery ${level}`, index + 1),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            hand: [reconstructiveSurgery, automatedGardener, woodlandSquirrels, woodlandSquirrels],
            field: [automatedGardener],
            graveyard: [automatedGardener, giantTortoise],
          },
        },
        playerTwo: {
          champion: lineageTestChampion(`Opponent ${level}`, 0),
          zones: { graveyard: [automatedGardener] },
        },
      });
      const player = game.player("player-one");
      const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      }));
      if (level < 2) {
        const before = game.state;
        expect(() =>
          player.activate(reconstructiveSurgery, {
            modeIds: ["mode-2"],
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activate(reconstructiveSurgery, {
        modeIds: ["mode-2"],
        reservePayment: payment,
      });
      passEffectsStack(game);
      const selected = player.card(automatedGardener, { zone: "graveyard" });
      for (const invalid of [
        player.card(giantTortoise, { zone: "graveyard" }),
        player.card(automatedGardener, { zone: "hand" }),
        player.card(automatedGardener, { zone: "field" }),
        game.player("player-two").card(automatedGardener, { zone: "graveyard" }),
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [selected.objectId]);
      passEffectsStack(game);
      expect(game.state.objects[selected.objectId]!.zone).toBe("memory");
      expect(player.cards(automatedGardener, { zone: "graveyard" })).toHaveLength(0);
    });
  }
});
