import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
import { describe } from "vitest";
import { frozenNova } from "./frozen-nova.ts";

/** @covers IyXuaLKjSA-a1 */
describe("Frozen Nova \u2014 resolution", () => {
  proveClassBonusEfficiency({ card: frozenNova, printedCost: 8, attack: false });
});

/** @covers IyXuaLKjSA-a2 */
describe("Frozen Nova's damage, rest, and each controller's skipped wake", () => {
  it("damages all allies and prevents precisely their next controller wake", () => {
    const champion = createClassBonusTestChampion(frozenNova, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [frozenNova, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
          field: [giantTortoise, woodlandSquirrels],
          "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [giantTortoise, woodlandSquirrels],
          "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      own = p.card(giantTortoise),
      foe = q.card(giantTortoise);
    p.activate(frozenNova, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    for (const player of [p, q]) {
      expect(game.state.objects[player.card(giantTortoise).objectId]!.damage).toBe(1);
      expect(game.state.objects[player.card(giantTortoise).objectId]!.states.has("rested")).toBe(
        true,
      );
      expect(player.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(0);
    }
    advanceToMain(game, q.id);
    expect(game.state.objects[foe.objectId]!.states.has("rested")).toBe(true);
    const first = game.state;
    expect(() => q.declareAttack(foe, p.card(champion))).toThrow();
    expect(game.state).toEqual(first);
    advanceToMain(game, p.id);
    expect(game.state.objects[own.objectId]!.states.has("rested")).toBe(true);
    const second = game.state;
    expect(() => p.declareAttack(own, q.card(champion))).toThrow();
    expect(game.state).toEqual(second);
    advanceToMain(game, q.id);
    q.declareAttack(foe, p.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    advanceToMain(game, p.id);
    p.declareAttack(own, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
  });
});
