import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { palatialConcourse } from "../domains/palatial-concourse.ts";
import { smashWithObelisk } from "./smash-with-obelisk.ts";

/** @covers 2kkvoqk1l7-a1 @covers 2kkvoqk1l7-a2 */
describe("Smash with Obelisk — Domain cost and inherited power", () => {
  it("sacrifices a controlled Domain and adds its reserve cost to combat power", () => {
    const champion = createClassBonusTestChampion(smashWithObelisk, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [palatialConcourse],
          hand: [smashWithObelisk, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const domain = player.card(palatialConcourse);
    const attacker = player.card(champion);
    const defender = game.player("player-two").card(champion);
    player.activate(smashWithObelisk, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      costSelections: [[domain.objectId]],
    });
    expect(game.state.objects[domain.objectId]!.zone).toBe("graveyard");
    expect(game.resolveStackUntilChoice()).toBe("decision");
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
      "declare Smash with Obelisk against the opposing champion",
    );
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(8);
  });

  it("rejects activation without the additional Domain sacrifice", () => {
    const champion = createClassBonusTestChampion(smashWithObelisk, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [smashWithObelisk, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    expect(() =>
      player.activate(smashWithObelisk, {
        attackAttackerId: player.card(champion).objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
  });
});
