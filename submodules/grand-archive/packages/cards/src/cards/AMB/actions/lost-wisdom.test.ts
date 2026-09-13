import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { lostWisdom } from "./lost-wisdom.ts";

function setup(classBonus: boolean, uniqueAlly: boolean) {
  const champion = createClassBonusTestChampion(lostWisdom, classBonus, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [lostWisdom, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        field: uniqueAlly ? [zhangFeiSpiritedSteel] : [galesMare],
        graveyard: [fireball, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { graveyard: [fireball] } },
  });
}

/** @covers 8codb9zatv-a1 */
describe("Lost Wisdom — Class Bonus unique-ally discount", () => {
  it("costs 2 with Class Bonus and a unique ally, otherwise 4", () => {
    for (const [classBonus, uniqueAlly, cost] of [
      [true, true, 2],
      [true, false, 4],
      [false, true, 4],
    ] as const) {
      const game = setup(classBonus, uniqueAlly);
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(lostWisdom, { reservePayment: payment.slice(0, cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(lostWisdom, { reservePayment: payment });
      expect(player.zone("memory")).toHaveLength(cost);
    }
  });
});

/** @covers 8codb9zatv-a2 */
describe("Lost Wisdom — return a Spell to memory", () => {
  it("returns a Spell from the graveyard and rejects non-Spells", () => {
    const game = setup(true, true);
    const player = game.player("player-one");
    const spell = player.card(fireball, { zone: "graveyard" });
    player.activate(lostWisdom, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        player.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
      ]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        game.player("player-two").card(fireball, { zone: "graveyard" }).objectId,
      ]),
    ).toThrow();
    answerDecision(game, "resolve-effect-choice", [spell.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[spell.objectId]!.zone).toBe("memory");
  });
});
