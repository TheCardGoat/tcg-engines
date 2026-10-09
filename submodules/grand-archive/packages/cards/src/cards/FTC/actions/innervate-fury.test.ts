import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { innervateFury } from "./innervate-fury.ts";

/** @covers wpbhigka5a-a1 @covers wpbhigka5a-a2 */
describe("Innervate Fury — paid delevel and declared damage targets", () => {
  for (const [leveled, damage, count] of [
    [false, 5, 2],
    [true, 4, 2],
    [true, 5, 0],
    [true, 5, 1],
    [true, 5, 2],
    [true, 5, 7],
    [true, 5, 8],
  ] as const) {
    it(`requires exact recovery and delevel; leveled=${leveled}, damage=${damage}, targets=${count}`, () => {
      const starter = enableAllTestElements(lineageTestChampion("Fury", 0));
      const next = enableAllTestElements(lineageTestChampion("Fury", 1));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: leveled ? [next] : [],
          zones: {
            hand: [
              innervateFury,
              ...Array.from({ length: damage }, () => singeingLeap),
              ...Array.from({ length: damage + 3 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: {
          champion: starter,
          zones: { field: Array.from({ length: 8 }, () => giantTortoise) },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hero = p.card(starter, { zone: "field" });
      for (const leap of p.cards(singeingLeap)) {
        p.activate(leap, {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      const targets = q.cards(giantTortoise).slice(0, count);
      const options = {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "damage-targets": targets.map((c) => c.objectId) },
      };
      const before = game.state;
      expect(() =>
        p.activate(innervateFury, {
          ...options,
          targets: { "damage-targets": [q.card(starter).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (!leveled || damage < 5 || count > 7) {
        expect(() => p.activate(innervateFury, options)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      expect(() =>
        p.activate(innervateFury, { ...options, reservePayment: options.reservePayment.slice(1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(innervateFury, options);
      expect(p.cards(next, { zone: "material-deck" })).toHaveLength(1);
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      expect(p.zone("memory")).toHaveLength(damage + 3);
      for (const target of targets) expect(game.state.objects[target.objectId]!.damage).toBe(0);
      passEffectsStack(game);
      if (count) {
        const beforeAllocation = game.state;
        expect(() =>
          answerDecision(game, "resolve-distribution", {
            allocations: [{ objectId: q.card(starter).objectId, amount: 7 }],
          }),
        ).toThrow();
        expect(game.state).toEqual(beforeAllocation);
        const allocations = targets.map((c, index) => ({
          objectId: c.objectId,
          amount: count === 2 ? (index === 0 ? 3 : 4) : count === 1 ? 7 : 1,
        }));
        answerDecision(game, "resolve-distribution", { allocations });
        for (const allocation of allocations) {
          const object = game.state.objects[allocation.objectId]!;
          expect(object.zone).toBe(count === 1 ? "graveyard" : "field");
          if (count !== 1) expect(object.damage).toBe(allocation.amount);
        }
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(p.card(innervateFury, { zone: "graveyard" })).toBeDefined();
      for (const untouched of q
        .cards(giantTortoise, { zone: "field" })
        .filter((c) => !targets.some((t) => t.objectId === c.objectId)))
        expect(game.state.objects[untouched.objectId]!.damage).toBe(0);
    });
  }
});
