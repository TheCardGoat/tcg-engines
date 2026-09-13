import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enchainingGale } from "../actions/enchaining-gale.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { dominatingStrike } from "./dominating-strike.ts";

/** @covers svd53zc9p4-a1 */
describe("Dominating Strike — Vanitas alternative cost", () => {
  it("reveals three Wind cards from memory instead of paying reserve", () => {
    const base = createClassBonusTestChampion(dominatingStrike, false, "activation-discount");
    if (base.layout.kind !== "single-faced") throw new Error("Expected champion");
    const champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...base.layout.face, lineageName: "Vanitas" },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [dominatingStrike],
          memory: [enchainingGale, enchainingGale, enchainingGale],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const memory = player.zone("memory");
    const historyIndex = game.state.eventHistory.length;
    player.activate(dominatingStrike, {
      attackAttackerId: player.card(champion).objectId,
      costOptionIndex: 1,
      costSelections: [memory.map((card) => card.objectId)],
    });
    expect(player.cards(dominatingStrike, { zone: "effects-stack" })).toHaveLength(1);
    expect(player.zone("memory")).toEqual(memory);
    expect(
      game.state.eventHistory.slice(historyIndex).filter((event) => event.type === "card-revealed"),
    ).toHaveLength(3);
  });
});

/** @covers svd53zc9p4-a2 */
describe("Dominating Strike — weapon prohibition", () => {
  it("offers only an unarmed declaration even when its attacker controls a weapon", () => {
    const champion = createClassBonusTestChampion(dominatingStrike, false, "activation-discount");
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [aurousteelGreatsword],
          hand: [dominatingStrike, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion: opponentChampion },
    });
    const player = game.player("player-one");
    const attacker = player.card(champion);
    const target = game.player("player-two").card(opponentChampion);
    player.activate(dominatingStrike, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    for (let step = 0; game.waitState().kind !== "decision" && step < 16; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const attackAnswers = game
      .legalCommands(player.id)
      .filter(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "attackerId" in candidate.command.answer,
      );
    expect(attackAnswers.length).toBeGreaterThan(0);
    expect(
      attackAnswers.every((candidate) => {
        const answer =
          candidate.command.move === "answer-decision" ? candidate.command.answer : null;
        return (
          typeof answer === "object" &&
          answer !== null &&
          (!("weaponIds" in answer) ||
            (Array.isArray(answer.weaponIds) && answer.weaponIds.length === 0))
        );
      }),
    ).toBe(true);
    player.executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "attackerId" in candidate.command.answer &&
        candidate.command.answer.attackerId === attacker.objectId &&
        !("delegatePlayerId" in candidate.command.answer) &&
        "targetIds" in candidate.command.answer &&
        Array.isArray(candidate.command.answer.targetIds) &&
        candidate.command.answer.targetIds.includes(target.objectId),
      "declare Dominating Strike unarmed",
    );
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
  });
});
