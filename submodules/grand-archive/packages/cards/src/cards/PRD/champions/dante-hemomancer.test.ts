import { describe } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { danteHemomancer } from "./dante-hemomancer.ts";

/** @covers 4FtNBFaOJp-a1 */
describe("Dante, Hemomancer — Lineage restriction", () => {
  proveChampionLineage({
    card: danteHemomancer,
    lineageName: "Dante",
    level: 3,
    memoryCost: 3,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sacredEngulfment } from "../../PTM/actions/sacred-engulfment.ts";

/** @covers 4FtNBFaOJp-a2 */
describe("Dante, Hemomancer — first damage of each empowered Spell", () => {
  for (const firstAccepted of [false, true])
    it(`can recover for a second distinct empowered Spell, first accepted=${firstAccepted}`, () => {
      const champion = enableAllTestElements(danteHemomancer);
      const starter = enableAllTestElements(lineageTestChampion("Dante", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [champion],
          zones: {
            hand: [
              fireball,
              fireball,
              sacredEngulfment,
              ...Array.from({ length: 10 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion: starter, lineage: [champion] },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        foe = q.card(starter);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activateAbility(hero, "4FtNBFaOJp-a3", { variables: { X: 4 }, reservePayment: pay(4) });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]?.damage).toBe(4);
      for (let index = 0; index < 2; index++) {
        if (index === 1) {
          p.activate(sacredEngulfment, { reservePayment: pay(1) });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", []);
          passEffectsStack(game);
        }
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(2),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.decision, `Spell ${index + 1}`).toMatchObject({
          kind: "resolve-optional-effect",
          playerId: p.id,
        });
        answerDecision(game, "resolve-optional-effect", index === 1 || firstAccepted);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]?.damage).toBe(
          4 - (firstAccepted ? 2 : 0) - (index === 1 ? 2 : 0),
        );
        expect(game.state.objects[foe.objectId]?.damage).toBe(8 * (index + 1));
      }
    });
});

import { burstAsunder } from "../../AMB/actions/burst-asunder.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";

/** @covers 4FtNBFaOJp-a2 */
describe("Dante, Hemomancer — repeated damage from one Spell", () => {
  for (const empowered of [false, true])
    for (const sacrificed of [0, 1, 2])
      for (const accepted of [false, true])
        it(`recovers once: empowered=${empowered}, extra damage events=${sacrificed}, accepted=${accepted}`, () => {
          const starter = enableAllTestElements(lineageTestChampion("Dante", 0));
          const champion = enableAllTestElements(danteHemomancer);
          let game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage: [champion],
              zones: {
                field: [deepSeaFractal, deepSeaFractal],
                hand: [
                  fireball,
                  burstAsunder,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion: starter, lineage: [champion] },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const hero = p.card(starter),
            foe = q.card(starter);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (empowered)
            p.activateAbility(hero, "4FtNBFaOJp-a3", {
              variables: { X: 4 },
              reservePayment: pay(4),
            });
          else
            p.activate(fireball, {
              reservePayment: pay(2),
              targets: { "target-1": [hero.objectId] },
            });
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[hero.objectId]?.damage).toBe(4);
          const spell = p.card(burstAsunder);
          p.activate(spell, { reservePayment: pay(2), targets: { "target-unit": [foe.objectId] } });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]?.damage).toBe(2);
          expect(game.state.objects[hero.objectId]?.damage).toBe(4);
          const restored = restoreGrandArchiveMatchSnapshot(
            game.program,
            JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
          );
          expect(restored).toEqual(game.state);
          game = GrandArchiveTestEngine.fromState(game.program, restored);
          answerDecision(
            game,
            "resolve-effect-choice",
            p
              .cards(deepSeaFractal, { zone: "field" })
              .slice(0, sacrificed)
              .map((c) => c.objectId),
          );
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]?.damage).toBe(2 + 2 * sacrificed);
          expect(
            game.state.eventHistory.filter(
              (e) => e.type === "damage-marked" && e.sourceId === spell.objectId,
            ),
          ).toHaveLength(1 + sacrificed);
          if (empowered) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-optional-effect",
              playerId: p.id,
            });
            answerDecision(game, "resolve-optional-effect", accepted);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.objects[hero.objectId]?.damage).toBe(empowered && accepted ? 2 : 4);
        });
});

import { imperialCountermeasure } from "../../RDO/actions/imperial-countermeasure.ts";

/** @covers 4FtNBFaOJp-a3 */
describe("Dante, Hemomancer — paid unpreventable damage and Empower", () => {
  for (const amount of [1, 2, 3, 4])
    for (const protectedHero of [false, true])
      it(`pays and empowers ${amount}, prevention=${protectedHero}`, () => {
        const starter = enableAllTestElements(lineageTestChampion("Dante", 0));
        const champion = enableAllTestElements(danteHemomancer);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: [champion],
            zones: {
              hand: [
                imperialCountermeasure,
                fireball,
                fireball,
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter, lineage: [champion] },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          foe = q.card(starter);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (protectedHero) {
          p.activate(imperialCountermeasure, {
            reservePayment: pay(1),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
        }
        for (const invalid of [0, 5]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(hero, "4FtNBFaOJp-a3", {
              variables: { X: invalid },
              reservePayment: pay(invalid),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        for (const invalidPayment of [amount - 1, amount + 1]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(hero, "4FtNBFaOJp-a3", {
              variables: { X: amount },
              reservePayment: pay(invalidPayment),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(hero, "4FtNBFaOJp-a3", {
          variables: { X: amount },
          reservePayment: pay(amount),
        });
        expect(game.state.objects[hero.objectId]?.states.has("rested")).toBe(true);
        expect(game.state.objects[hero.objectId]?.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]?.damage).toBe(amount);
        const restedState = game.state;
        expect(() =>
          p.activateAbility(hero, "4FtNBFaOJp-a3", { variables: { X: 1 }, reservePayment: pay(1) }),
        ).toThrow();
        expect(game.state).toEqual(restedState);
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(2),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]?.damage).toBe(4 + amount);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]?.damage).toBe(Math.max(0, amount - 2));
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(2),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[hero.objectId]?.damage).toBe(
          Math.max(0, amount - 2) + (protectedHero ? 0 : 4),
        );
      });
});

import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/testing";
