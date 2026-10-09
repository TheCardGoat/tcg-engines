import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fluteOfTaming } from "../cards/DOA/items/flute-of-taming.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveChargedBanishmentActivation(card: Card, cost: number, classCharge: boolean) {
  for (const matching of [false, true])
    for (const ownTurn of [false, true])
      for (const elements of [false, true])
        it(`class=${matching}, own turn=${ownTurn}, elements=${elements}`, () => {
          const original = createClassBonusTestChampion(card, matching, "activation-discount");
          const base = {
            ...original,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(original), elements: ["NORM"] as ["NORM"] },
            },
          };
          const champion = elements ? enableAllTestElements(base) : base;
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                memory: [card],
                "material-deck": [fluteOfTaming],
                hand: Array.from({ length: cost * 2 }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            enemy = q.card(champion);
          p.materialize(fluteOfTaming);
          passEffectsStack(game);
          const charged = !classCharge || matching;
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(
            charged ? 1 : 0,
          );
          advanceToMain(game, ownTurn ? p.id : q.id);
          if (!ownTurn) q.pass();
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const targets = {
            [classCharge ? "target-1" : "target-players"]: classCharge ? [enemy.objectId] : [],
          };
          const before = game.state;
          if (!charged || !elements || (!classCharge && !ownTurn)) {
            expect(() => p.activate(source, { reservePayment: pay(cost), targets })).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          expect(() => p.activate(source, { reservePayment: pay(cost - 1), targets })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: pay(cost), targets });
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(0);
          expect(game.state.objects[enemy.objectId]!.damage).toBe(classCharge ? 2 : 0);
          const after = game.state;
          expect(() => p.activate(source, { reservePayment: pay(cost), targets })).toThrow();
          expect(game.state).toEqual(after);
        });
  for (const zone of ["banishment", "graveyard", "memory"] as const)
    it(`cannot activate uncharged card from ${zone}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, true, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { [zone]: [card], hand: Array.from({ length: cost }, () => woodlandSquirrels) },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        before = game.state;
      expect(() =>
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: classCharge
            ? { "target-1": [q.card(champion).objectId] }
            : { "target-players": [] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
}
