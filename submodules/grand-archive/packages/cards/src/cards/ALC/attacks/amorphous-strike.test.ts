import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { cyclonicStrike } from "./cyclonic-strike.ts";
import { subjugatingLash } from "./subjugating-lash.ts";
import { amorphousStrike } from "./amorphous-strike.ts";

function fixture(classBonus: boolean) {
  const champion = createClassBonusTestChampion(amorphousStrike, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [amorphousStrike, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        graveyard: [subjugatingLash, cyclonicStrike, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { graveyard: [subjugatingLash] } },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const attacker = player.card(champion, { zone: "field" });
  const defender = opponent.card(champion, { zone: "field" });
  player.activate(amorphousStrike, {
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
    "declare Amorphous Strike against the opposing champion",
  );
  return { game, champion, defender };
}

/** @covers 5kt3q2svd5-a1 */
describe("Amorphous Strike — graveyard attack power", () => {
  it("does not trigger without Class Bonus", () => {
    const { game, defender } = fixture(false);
    advanceCombatToTrigger(game, "5kt3q2svd5-a1");
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[defender.objectId]!.damage).toBe(4);
  });

  it("may decline without changing its four power", () => {
    const { game, defender } = fixture(true);
    advanceCombatToTrigger(game, "5kt3q2svd5-a1");
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", false);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(4);
  });

  it("banishes only its own Attack card and adds that card's two power", () => {
    const { game, defender } = fixture(true);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const chosen = player.card(subjugatingLash, { zone: "graveyard" });
    advanceCombatToTrigger(game, "5kt3q2svd5-a1");
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    for (const invalid of [
      player.card(woodlandSquirrels, { zone: "graveyard" }),
      opponent.card(subjugatingLash, { zone: "graveyard" }),
    ]) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
    expect(player.cards(subjugatingLash, { zone: "banishment" })).toEqual([chosen]);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(6);
  });
});
