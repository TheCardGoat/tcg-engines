import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { pridesSmith } from "./prides-smith.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";

/** @covers cb2c4o20mf-a1 */
it("gives only a controlled Warrior weapon its additional usable durability when the entry trigger resolves", () => {
  const champion = createClassBonusTestChampion(pridesSmith, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [pridesSmith, woodlandSquirrels, woodlandSquirrels],
        field: [trainingSword, curvedDagger],
        graveyard: [trainingSword],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [trainingSword],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    sword = p.card(trainingSword, { zone: "field" });
  p.activate(pridesSmith, {
    reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  expect(game.state.objects[p.card(pridesSmith).objectId]!.zone).toBe("field");
  for (const invalid of [
    q.card(trainingSword),
    p.card(curvedDagger),
    p.card(pridesSmith),
    p.card(trainingSword, { zone: "graveyard" }),
  ]) {
    const before = game.state;
    expect(() =>
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [invalid.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  }
  answerDecision(game, "announce-triggered-ability", { targets: { "target-1": [sword.objectId] } });
  expect(game.state.objects[sword.objectId]!.counters.durability).toBe(2);
  passEffectsStack(game);
  expect(game.state.objects[sword.objectId]!.counters.durability).toBe(3);
  expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(2);
  for (let attack = 0; attack < 3; attack++) {
    p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [sword.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(attack + 1);
    expect(game.state.objects[sword.objectId]!.zone).toBe(attack === 2 ? "banishment" : "field");
    if (attack < 2) {
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
    }
  }
});
