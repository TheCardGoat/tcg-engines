import { describe, expect, it } from "vitest";
import { memoryRevealFixture } from "../../../testing/memory-reveal-fixture.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lightweaversAssault } from "./lightweavers-assault.ts";
/** @covers zxB4tzy9iy-a2 */
for (const boundary of ["enabled", "class", "element", "hand", "opponent"] as const)
  for (const target of ["own", "ally", "champion"] as const)
    it(`revealed Assault boundary=${boundary},target=${target}`, () => {
      const { game, p, q, hero, foe, source, reveal } = memoryRevealFixture(
        lightweaversAssault,
        boundary !== "class",
        boundary !== "element",
        boundary === "hand" ? "hand" : "memory",
      );
      const chosen =
        target === "own" ? p.card(giantTortoise) : target === "ally" ? q.card(giantTortoise) : foe;
      reveal(boundary !== "opponent");
      if (boundary === "enabled") {
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-effect-choice", [q.card(trainingSword).objectId]),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
        passEffectsStack(game);
      }
      expect(game.state.objects[chosen.objectId]!.damage).toBe(boundary === "enabled" ? 2 : 0);
      expect(game.state.objects[source.objectId]!.zone).toBe(
        boundary === "hand" ? "hand" : "memory",
      );
    });
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
/** @covers zxB4tzy9iy-a1 */
for (const memory of [0, 2])
  for (const split of [false, true])
    it(`Assault reveals existing and paid memory and distributes the exact total: memory=${memory},split=${split}`, () => {
      const champion = createClassBonusTestChampion(
          lightweaversAssault,
          false,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [lightweaversAssault, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              memory: Array.from({ length: memory }, () => woodlandSquirrels),
              field: [giantTortoise],
            },
          },
          playerTwo: {
            champion,
            zones: { memory: [woodlandSquirrels], field: [trainingSword, giantTortoise] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        foe = q.card(champion),
        ally = p.card(giantTortoise),
        pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(lightweaversAssault, { reservePayment: pay.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(lightweaversAssault, { reservePayment: pay });
      const revealed = p.zone("memory").map((c) => c.objectId);
      passEffectsStack(game);
      expect(revealed).toHaveLength(memory + 4);
      const total = memory + 4;
      for (const allocations of [
        [],
        [{ objectId: foe.objectId, amount: total - 1 }],
        [{ objectId: foe.objectId, amount: total + 1 }],
        [{ objectId: q.card(trainingSword).objectId, amount: total }],
        [
          { objectId: foe.objectId, amount: total },
          { objectId: ally.objectId, amount: 0 },
        ],
      ]) {
        const state = game.state;
        expect(() => answerDecision(game, "resolve-distribution", { allocations })).toThrow();
        expect(game.state).toEqual(state);
      }
      answerDecision(game, "resolve-distribution", {
        allocations: [
          { objectId: foe.objectId, amount: total - (split ? 1 : 0) },
          ...(split ? [{ objectId: ally.objectId, amount: 1 }] : []),
        ],
      });
      passEffectsStack(game);
      expect(game.state.objects[foe.objectId]!.damage).toBe(total - (split ? 1 : 0));
      expect(game.state.objects[ally.objectId]!.damage).toBe(split ? 1 : 0);
      expect(q.card(giantTortoise)).toBeDefined();
      expect(p.zone("memory").map((c) => c.objectId)).toEqual(revealed);
      expect(q.zone("memory")).toHaveLength(1);
    });
