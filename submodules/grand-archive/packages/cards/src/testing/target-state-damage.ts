import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { theMajesticSpirit } from "../cards/FTC/allies/the-majestic-spirit.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveTargetStateDamage(card: Card, damaged: boolean, units = false) {
  const ally = damaged ? theMajesticSpirit : giantTortoise;
  for (const owner of ["own", "opponent"])
    for (const mode of [
      "none",
      "active",
      "other",
      "response",
      ...(damaged ? [] : ["wake-response"]),
    ])
      it(`reads only target state at resolution: target=${owner}, mode=${mode}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Target state", 0));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [ally, trainingSword],
              graveyard: [ally],
              hand: [
                card,
                sparkAlight,
                glacialGuidance,
                secondWind,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [ally, trainingSword] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = (owner === "own" ? p : q).card(ally, { zone: "field" });
        const other = (owner === "own" ? q : p).card(ally, { zone: "field" });
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const setState = (ref: typeof target) =>
          p.activate(damaged ? sparkAlight : glacialGuidance, {
            reservePayment: pay(damaged ? 2 : 1),
            targets: { "target-1": [ref.objectId] },
          });
        if (["active", "other", "wake-response"].includes(mode)) {
          setState(mode === "other" ? other : target);
          passEffectsStack(game);
        }
        const cost = damaged ? 3 : 2;
        const before = game.state;
        const invalid = [
          p.card(trainingSword).objectId,
          p.card(ally, { zone: "graveyard" }).objectId,
          ...(!units ? [p.card(champion).objectId, q.card(champion).objectId] : []),
        ];
        for (const id of invalid) {
          expect(() =>
            p.activate(card, { reservePayment: pay(cost), targets: { "target-1": [id] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(card, { reservePayment: pay(cost), targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[target.objectId]!.damage).toBe(
          damaged && mode === "active" ? 2 : 0,
        );
        if (mode === "response") setState(target);
        if (mode === "wake-response")
          p.activate(secondWind, {
            reservePayment: pay(3),
            targets: { "target-1": [target.objectId] },
          });
        passEffectsStack(game);
        const increased = mode === "active" || mode === "response";
        expect(game.state.objects[target.objectId]!.damage).toBe(
          damaged && increased ? 8 : increased ? 3 : 2,
        );
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        expect(game.state.objects[other.objectId]!.damage).toBe(
          damaged && mode === "other" ? 2 : 0,
        );
        if (!damaged)
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(increased);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.decision).toBeNull();
      });
  if (units)
    for (const owner of ["own", "opponent"])
      for (const rested of [false, true])
        it(`also damages a ${rested ? "rested" : "awake"} ${owner} champion`, () => {
          const champion = enableAllTestElements(lineageTestChampion("Target champion state", 0));
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: owner === "own" ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [trainingSword, giantTortoise],
                hand: [card, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { field: [trainingSword, giantTortoise] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const active = owner === "own" ? p : q,
            defending = owner === "own" ? q : p;
          const target = active.card(champion);
          if (rested) {
            active.declareAttack(target, defending.card(giantTortoise), {
              weaponIds: [active.card(trainingSword).objectId],
            });
            game.resolveCombatWithoutRetaliation();
          }
          if (owner === "opponent") advanceToMain(game, p.id);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(rested);
          p.activate(card, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(rested ? 3 : 2);
          expect(game.state.objects[defending.card(champion).objectId]!.damage).toBe(0);
        });
}
