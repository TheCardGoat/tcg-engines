import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { aeneanCyclone } from "../cards/PRD/actions/aenean-cyclone.ts";
import { aeneanSwellingGusts } from "../cards/PRD/actions/aenean-swelling-gusts.ts";
import { swiftRecruit } from "../cards/DOA/allies/swift-recruit.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveElysianAura(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  damageBonusPerCopy = 0,
): void {
  const resolve = (game: GrandArchiveTestEngine) => {
    for (let step = 0; step < 32; step++) {
      passEffectsStack(game);
      const decision = game.state.decision;
      if (!decision) return;
      if (decision.kind !== "choose-replacement") throw new Error(`Unexpected ${decision.kind}`);
      answerDecision(game, "choose-replacement", decision.candidateIds[0]);
    }
    throw new Error("Damage replacements did not finish");
  };
  const setup = (level: number, copies: number) => {
    const champion = grantTestChampionLevel(
      enableAllTestElements(createClassBonusTestChampion(fireball, true, "activation-discount")),
      level,
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [swiftRecruit, ...Array.from({ length: copies }, () => card)],
          hand: [
            aeneanCyclone,
            aeneanSwellingGusts,
            fireball,
            ...Array.from({ length: 22 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [card, card] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const pay = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const actualLevel = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[p.card(champion).objectId]!, "level", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      });
    return { game, p, q, pay, actualLevel, champion };
  };
  for (const level of [0, 1, 3])
    for (const copies of [0, 1, 2])
      it(`Elysian Aura level=${level}, own copies=${copies}: exact cost, restricted resolution, normal Spell`, () => {
        const { game, p, q, pay, actualLevel, champion } = setup(level, copies);
        const effective = level + (copies ? 2 : 0),
          cost = 13 - effective;
        const before = game.state;
        expect(() =>
          p.activate(aeneanCyclone, { reservePayment: pay(cost - 1), targets: { "target-1": [] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(aeneanCyclone, { reservePayment: pay(cost), targets: { "target-1": [] } });
        expect(p.zone("memory")).toHaveLength(cost);
        expect(actualLevel()).toBe(level);
        resolve(game);
        const gustCost = effective >= 3 ? 2 : 4;
        p.activate(aeneanSwellingGusts, {
          reservePayment: pay(gustCost),
          targets: { "target-1": [q.card(champion).objectId] },
        });
        const paidMemory = cost + gustCost;
        expect(p.zone("memory")).toHaveLength(paidMemory);
        resolve(game);
        expect(p.zone("memory")).toHaveLength(paidMemory + (effective >= 5 ? 1 : 0));
        expect(actualLevel()).toBe(level);
        const prior = game.state.objects[q.card(champion).objectId]!.damage;
        expect(prior).toBe(1 + damageBonusPerCopy * copies);
        p.activate(fireball, {
          reservePayment: pay(2),
          targets: { "target-1": [q.card(champion).objectId] },
        });
        resolve(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(prior + 1 + level);
        expect(actualLevel()).toBe(level);
      });
  for (const copies of [1, 2])
    it(`losing one of ${copies} Aura sources after activation changes resolution but not paid cost`, () => {
      const { game, p, q, pay, actualLevel, champion } = setup(3, copies);
      p.activate(aeneanSwellingGusts, {
        reservePayment: pay(2),
        targets: { "target-1": [q.card(champion).objectId] },
      });
      p.activate(aeneanCyclone, {
        reservePayment: pay(8),
        targets: { "target-1": [p.cards(card, { zone: "field" })[0]!.objectId] },
      });
      expect(p.zone("memory")).toHaveLength(10);
      resolve(game);
      expect(p.cards(card, { zone: "field" })).toHaveLength(copies - 1);
      expect(p.zone("memory")).toHaveLength(10 + (copies === 2 ? 1 : 0));
      expect(actualLevel()).toBe(3);
    });
}
