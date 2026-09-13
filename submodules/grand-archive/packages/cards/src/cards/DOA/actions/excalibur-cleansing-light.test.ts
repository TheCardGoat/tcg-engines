import { proveDestroyObjectAction } from "../../../testing/destroy-object-action.ts";
import { describe } from "vitest";
import { excaliburCleansingLight } from "./excalibur-cleansing-light.ts";

/** @covers qtRBz9azeZ-a1 */
describe("Excalibur, Cleansing Light \u2014 resolution", () => {
  proveDestroyObjectAction({ card: excaliburCleansingLight, cost: 2, cheapRegalia: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { gemOfSearingFlame } from "../../AMB/items/gem-of-searing-flame.ts";
import { ebbingTide } from "../../AMB/items/ebbing-tide.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers qtRBz9azeZ-a2 */
for (const bonus of [false, true])
  for (const amount of [0, 1, 2])
    it(`Cleansing Light forbids selected elements for both players through opponent turn only: class=${bonus},count=${amount}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(excaliburCleansingLight, bonus, "activation-discount"),
      );
      const hand = [
        blitzMage,
        giantTortoise,
        ...Array.from({ length: 13 }, () => woodlandSquirrels),
      ];
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [excaliburCleansingLight, ...hand],
            field: [giantTortoise],
            "material-deck": [gemOfSearingFlame],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand,
            "material-deck": [gemOfSearingFlame, ebbingTide, trainingSword],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activate(excaliburCleansingLight, {
        targets: { "target-1": [p.card(giantTortoise, { zone: "field" }).objectId] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (bonus) {
        for (const bad of [["NORM"], ["FIRE", "WATER", "WIND"], ["FIRE", "FIRE"]]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", ["FIRE", "WATER"].slice(0, amount));
        passEffectsStack(game);
      }
      const checkActivations = (actor: typeof p) => {
        const wood = actor.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        actor.activate(wood);
        passEffectsStack(game);
        for (const [index, card, cost] of [
          [0, blitzMage, 3],
          [1, giantTortoise, 4],
        ] as const) {
          const source = actor.card(card, { zone: "hand" }),
            payment = actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, cost)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (bonus && amount > index) {
            const before = game.state;
            expect(() => actor.activate(source, { reservePayment: payment })).toThrow();
            expect(game.state).toEqual(before);
          } else {
            actor.activate(source, { reservePayment: payment });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
          }
        }
      };
      checkActivations(p);
      for (
        let i = 0;
        i < 96 && !(game.state.turn.playerId === q.id && game.state.turn.phase === "materialize");
        i++
      ) {
        const w = game.waitState();
        if (w.kind === "opportunity") game.player(w.playerId).pass();
        else throw new Error("Expected turn progress");
      }
      for (const [index, card] of [
        [0, gemOfSearingFlame],
        [1, ebbingTide],
      ] as const)
        if (bonus && amount > index) {
          const before = game.state;
          expect(() => q.materialize(card)).toThrow();
          expect(game.state).toEqual(before);
        }
      q.materialize(bonus && amount > 0 ? trainingSword : gemOfSearingFlame);
      passEffectsStack(game);
      advanceToMain(game, q.id);
      checkActivations(q);
      for (
        let i = 0;
        i < 96 && !(game.state.turn.playerId === p.id && game.state.turn.phase === "materialize");
        i++
      ) {
        const w = game.waitState();
        if (w.kind !== "opportunity") throw new Error("Expected opportunity");
        game.player(w.playerId).pass();
      }
      p.materialize(gemOfSearingFlame);
      passEffectsStack(game);
      expect(p.card(gemOfSearingFlame, { zone: "field" })).toBeDefined();
      advanceToMain(game, p.id);
      if (bonus && amount > 0) {
        const source = p.card(blitzMage, { zone: "hand" });
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      }
    });
