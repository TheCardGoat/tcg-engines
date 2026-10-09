import { describe } from "vitest";
import { proveAllySacrificeCost } from "../../../testing/ally-sacrifice-cost.ts";
import { umbilicalRitual } from "./umbilical-ritual.ts";

/** @covers TfBuA9PUAO-a1 */
describe("umbilical-ritual — additional ally sacrifice", () => {
  proveAllySacrificeCost(umbilicalRitual, 0, false);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";

/** @covers TfBuA9PUAO-a2 */
describe("Umbilical Ritual — capped recovery and next-Spell Empower", () => {
  for (const matching of [false, true])
    for (const damage of [0, 2, 5])
      for (const mode of [
        "normal",
        "early-spell",
        "skill",
        "opponent",
        "expired",
        "second-ritual",
      ]) {
        it(`recovers at resolution and empowers only the next Spell: class=${matching}, damage=${damage}, mode=${mode}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(umbilicalRitual, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  umbilicalRitual,
                  umbilicalRitual,
                  fireball,
                  fireball,
                  ...Array.from({ length: damage + 1 }, () => singeingLeap),
                  ...Array.from({ length: damage + 12 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise, giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [
                  fireball,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const leap of p.cards(singeingLeap).slice(0, damage)) {
            p.activate(leap, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          const ritual = () =>
            p.activate(p.cards(umbilicalRitual, { zone: "hand" })[0]!, {
              costSelections: [[p.cards(giantTortoise, { zone: "field" })[0]!.objectId]],
            });
          const burn = () =>
            p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
              reservePayment: pay(matching ? 2 : 4),
              targets: { "target-1": [foe.objectId] },
            });
          ritual();
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          if (mode === "early-spell") burn();
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 4));
          expect(game.state.objects[foe.objectId]!.damage).toBe(mode === "early-spell" ? 1 : 0);
          if (mode === "skill") {
            p.activate(p.cards(singeingLeap, { zone: "hand" })[0]!, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          if (mode === "opponent") {
            p.pass();
            q.activate(fireball, {
              reservePayment: q
                .cards(woodlandSquirrels)
                .slice(0, matching ? 2 : 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 4) + 1);
          }
          if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
          if (mode === "second-ritual") {
            ritual();
            passEffectsStack(game);
          }
          expect(
            deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }),
          ).toBe(0);
          burn();
          passEffectsStack(game);
          const total = (mode === "early-spell" ? 1 : 0) + (mode === "expired" ? 1 : 5);
          expect(game.state.objects[foe.objectId]!.damage).toBe(total);
          if (mode !== "early-spell") {
            burn();
            passEffectsStack(game);
            expect(game.state.objects[foe.objectId]!.damage).toBe(total + 1);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
        });
      }
});
