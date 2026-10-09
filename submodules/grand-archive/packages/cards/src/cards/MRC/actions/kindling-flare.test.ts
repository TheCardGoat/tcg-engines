import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { atmosArmorTypeHermes } from "../../PRD/allies/atmos-armor-type-hermes.ts";
import { coronationCeremony } from "../../PRD/actions/coronation-ceremony.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { kindlingFlare } from "./kindling-flare.ts";

/** @covers dcgw05qzza-a1 @covers dcgw05qzza-a2 */
describe("Kindling Flare — any number of Herbs pays for split damage", () => {
  for (const count of [0, 1, 2, 4]) {
    for (const split of [false, true]) {
      it(`sacrifices ${count} Herbs and assigns ${1 + count} damage, split=${split}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(kindlingFlare, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [kindlingFlare, woodlandSquirrels, woodlandSquirrels],
              field: [springleaf, springleaf, springleaf, springleaf, trainingSword, giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [springleaf, giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(kindlingFlare);
        const donors = p.cards(springleaf, { zone: "field" });
        const reservePayment = p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const selected = donors.slice(0, count).map((c) => c.objectId);
        const target = q.card(giantTortoise).objectId;
        const self = p.card(champion).objectId;
        const targets = { "damage-targets": split ? [self, ...(count ? [target] : [])] : [target] };
        const before = game.state;
        for (const invalid of [
          [q.card(springleaf).objectId],
          [p.card(trainingSword).objectId],
          [p.card(giantTortoise).objectId],
          [donors[0]!.objectId, donors[0]!.objectId],
        ]) {
          expect(() =>
            p.activate(source, { reservePayment, costSelections: [invalid], targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, {
            targets,
            reservePayment: reservePayment.slice(1),
            costSelections: [selected],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment, costSelections: [selected], targets });
        expect(p.zone("memory")).toHaveLength(2);
        expect(p.cards(springleaf, { zone: "field" })).toHaveLength(4 - count);
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        expect(
          game.state.stack[0]!.targets.find((t) => t.binding === "damage-targets")?.targetIds,
        ).toEqual(targets["damage-targets"]);
        passEffectsStack(game);
        const total = count + 1;
        const decisionState = game.state;
        for (const allocations of [
          [],
          [{ objectId: p.card(giantTortoise).objectId, amount: total }],
          [{ objectId: target, amount: total + 1 }],
          [{ objectId: p.card(trainingSword).objectId, amount: total }],
          [
            { objectId: target, amount: 1 },
            { objectId: target, amount: total - 1 },
          ],
        ]) {
          expect(() => answerDecision(game, "resolve-distribution", { allocations })).toThrow();
          expect(game.state).toEqual(decisionState);
        }
        const ownDamage = split ? 1 : 0;
        const allocations = split
          ? [{ objectId: self, amount: 1 }, ...(count ? [{ objectId: target, amount: count }] : [])]
          : [{ objectId: target, amount: total }];
        answerDecision(game, "resolve-distribution", { allocations });
        passEffectsStack(game);
        expect(game.state.objects[target]!.damage).toBe(total - ownDamage);
        expect(game.state.objects[self]!.damage).toBe(ownDamage);
        expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(0);
        expect(q.cards(springleaf, { zone: "field" })).toHaveLength(1);
        for (const id of selected) expect(game.state.objects[id]).toBeUndefined();
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
      });
    }
  }
});

/** @covers dcgw05qzza-a1 @covers dcgw05qzza-a2 */
describe("Kindling Flare — announcement targets", () => {
  for (const mode of [
    "empty",
    "too-many",
    "own-shroud",
    "opposing-shroud",
    "omit-allocation",
    "partial-shroud",
    "all-shroud",
    "partial-return",
    "all-return",
  ] as const) {
    it(`keeps target legality and positive allocations: ${mode}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(kindlingFlare, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [kindlingFlare, woodlandSquirrels, woodlandSquirrels],
            field: [springleaf, atmosArmorTypeHermes],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, giantTortoise, atmosArmorTypeHermes],
            hand: [
              coronationCeremony,
              reclaim,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(kindlingFlare),
        herb = p.card(springleaf);
      const victims = q.cards(giantTortoise);
      const selected =
        mode === "empty"
          ? []
          : mode === "own-shroud"
            ? [p.card(atmosArmorTypeHermes).objectId]
            : mode === "opposing-shroud"
              ? [q.card(atmosArmorTypeHermes).objectId]
              : mode.startsWith("all-")
                ? [victims[0]!.objectId]
                : victims.map((c) => c.objectId);
      const options = {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "damage-targets": selected },
        costSelections: [mode === "too-many" ? [] : [herb.objectId]],
      };
      if (["too-many", "own-shroud", "opposing-shroud"].includes(mode)) {
        const before = game.state;
        expect(() => p.activate(source, options)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activate(source, options);
      expect(p.cards(springleaf, { zone: "field" })).toHaveLength(0);
      if (mode.includes("shroud") || mode.includes("return")) {
        p.pass();
        const protection = mode.includes("shroud") ? coronationCeremony : reclaim;
        const cost = mode.includes("shroud") ? 3 : 2;
        q.activate(protection, {
          reservePayment: q
            .cards(woodlandSquirrels)
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [victims[0]!.objectId] },
        });
      }
      passEffectsStack(game);
      if (mode === "empty" || mode.startsWith("all-")) {
        expect(game.state.decision).toBeNull();
        for (const victim of victims) expect(game.state.objects[victim.objectId]!.damage).toBe(0);
      } else {
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-distribution", {
            allocations: [{ objectId: q.card(champion).objectId, amount: 2 }],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (mode === "omit-allocation") {
          expect(() =>
            answerDecision(game, "resolve-distribution", {
              allocations: [{ objectId: victims[0]!.objectId, amount: 2 }],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-distribution", {
            allocations: victims.map((c) => ({ objectId: c.objectId, amount: 1 })),
          });
          for (const victim of victims) expect(game.state.objects[victim.objectId]!.damage).toBe(1);
        } else {
          expect(() =>
            answerDecision(game, "resolve-distribution", {
              allocations: [{ objectId: victims[0]!.objectId, amount: 2 }],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-distribution", {
            allocations: [{ objectId: victims[1]!.objectId, amount: 2 }],
          });
          expect(game.state.objects[victims[0]!.objectId]!.damage).toBe(0);
          expect(game.state.objects[victims[1]!.objectId]!.damage).toBe(2);
        }
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.stack).toHaveLength(0);
    });
  }
});
