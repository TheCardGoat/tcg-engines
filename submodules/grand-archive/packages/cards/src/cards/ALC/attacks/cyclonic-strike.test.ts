import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { cyclonicStrike } from "./cyclonic-strike.ts";

function fixture(classBonus: boolean) {
  const champion = createClassBonusTestChampion(cyclonicStrike, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [cyclonicStrike, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        field: [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
  });
  const player = game.player("player-one");
  const attacker = player.card(champion, { zone: "field" });
  const defender = game.player("player-two").card(champion, { zone: "field" });
  player.activate(cyclonicStrike, {
    attackAttackerId: attacker.objectId,
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card", cardId: card.objectId })),
  });
  passEffectsStack(game);
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
      candidate.command.answer.targetIds.includes(defender.objectId),
    "declare Cyclonic Strike against the opposing champion",
  );
  return { game, champion, attacker, defender };
}

/** @covers 3ir1o0qtb3-a1 */
describe("Cyclonic Strike — Class Bonus suppression", () => {
  it("rejects the ability without Class Bonus while the attack is in intent", () => {
    const { game } = fixture(false);
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(cyclonicStrike, "3ir1o0qtb3-a1", {
        targets: {
          "target-1": [game.player("player-two").card(woodlandSquirrels).objectId],
        },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("suppresses an opposing ally once and reduces this attack from four power to two", () => {
    const { game, champion, defender } = fixture(true);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const targetAlly = opponent.card(woodlandSquirrels, { zone: "field" });
    for (const invalid of [
      player.card(woodlandSquirrels, { zone: "field" }),
      opponent.card(champion, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activateAbility(cyclonicStrike, "3ir1o0qtb3-a1", {
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    player.activateAbility(cyclonicStrike, "3ir1o0qtb3-a1", {
      targets: { "target-1": [targetAlly.objectId] },
    });
    const afterActivation = game.state;
    expect(() =>
      player.activateAbility(cyclonicStrike, "3ir1o0qtb3-a1", {
        targets: { "target-1": [targetAlly.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(afterActivation);
    passEffectsStack(game);
    expect(opponent.cards(woodlandSquirrels, { zone: "banishment" })).toEqual([targetAlly]);

    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(2);
  });
});
