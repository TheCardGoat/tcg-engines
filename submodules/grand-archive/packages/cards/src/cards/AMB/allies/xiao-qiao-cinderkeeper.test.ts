import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { xiaoQiaoCinderkeeper } from "./xiao-qiao-cinderkeeper.ts";

/** @covers 3hgldrogit-a2 */
describe("Xiao Qiao, Cinderkeeper — Class Bonus no retaliation", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        xiaoQiaoCinderkeeper,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [xiaoQiaoCinderkeeper] } },
        playerTwo: { champion, zones: { field: [giantTortoise] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const tortoise = opponent.card(giantTortoise, { zone: "field" });
      player.declareAttack(xiaoQiaoCinderkeeper, tortoise);
      let retaliated = false;
      for (let step = 0; game.state.combat && step < 40; step++) {
        const wait = game.waitState();
        if (game.state.decision?.kind === "choose-retaliators") {
          if (classBonus) {
            const before = game.state;
            expect(() => answerDecision(game, "choose-retaliators", [tortoise.objectId])).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "choose-retaliators", []);
          } else {
            answerDecision(game, "choose-retaliators", [tortoise.objectId]);
            retaliated = true;
          }
        } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      expect(retaliated).toBe(!classBonus);
      expect(game.state.objects[tortoise.objectId]!.damage).toBe(1);
    });
  }
});

/** @covers 3hgldrogit-a3 */
describe("Xiao Qiao, Cinderkeeper — banish units she hits", () => {
  it("banishes a unit she hits this turn and leaves other deaths in the graveyard", () => {
    const champion = createClassBonusTestChampion(
      xiaoQiaoCinderkeeper,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [xiaoQiaoCinderkeeper, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const victims = opponent.cards(woodlandSquirrels, { zone: "field" });
    player.declareAttack(xiaoQiaoCinderkeeper, victims[0]!);
    game.resolveCombatWithoutRetaliation();
    const first = victims[0]!;
    expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
    expect(
      [...opponent.zone("banishment"), ...opponent.zone("graveyard")].some(
        (ref) => ref.objectId === first.objectId,
      ),
    ).toBe(true);

    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.declareAttack(woodlandSquirrels, victims[1]!);
    game.resolveCombatWithoutRetaliation();
    expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(0);
  });
});
