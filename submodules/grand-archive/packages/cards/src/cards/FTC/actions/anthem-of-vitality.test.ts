import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../../DOA/allies/gray-wolf.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { songOfFrost } from "./song-of-frost.ts";
import { anthemOfVitality } from "./anthem-of-vitality.ts";

/** @covers vbgl6ffqsu-a1 @covers vbgl6ffqsu-a2 */
describe("Anthem of Vitality — targeted protection and untargeted Harmonize", () => {
  for (const matching of [false, true])
    for (const mode of [
      "none",
      "own-before",
      "own-response",
      "opponent",
      "expired",
      "skill",
      "no-choice",
      "removed-choice",
    ]) {
      it(`checks Melody at resolution and protects only the declared target: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(anthemOfVitality, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                anthemOfVitality,
                songOfFrost,
                singeingLeap,
                reclaim,
                fireball,
                fireball,
                ...Array.from({ length: 18 }, () => woodlandSquirrels),
              ],
              field: [automatonDrone, ...(mode === "no-choice" ? [] : [woodlandSquirrels])],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [grayWolf, woodlandSquirrels],
              hand: [songOfFrost, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = q.card(grayWolf);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const sing = () => p.activate(songOfFrost, { reservePayment: pay(2) });
        if (["own-before", "expired", "no-choice", "removed-choice"].includes(mode)) {
          sing();
          passEffectsStack(game);
        }
        if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
        if (mode === "opponent") {
          p.pass();
          q.activate(songOfFrost, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
        }
        if (mode === "skill") {
          p.activate(singeingLeap, { reservePayment: pay(1) });
          passEffectsStack(game);
        }
        const numeric = (id: typeof target.objectId, property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const before = game.state;
        for (const ids of [
          [],
          [p.card(automatonDrone).objectId],
          [p.card(champion).objectId],
          [target.objectId, q.card(woodlandSquirrels, { zone: "field" }).objectId],
        ]) {
          expect(() =>
            p.activate(anthemOfVitality, { reservePayment: pay(2), targets: { "target-1": ids } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(anthemOfVitality, {
          reservePayment: pay(2),
          targets: { "target-1": [target.objectId] },
        });
        expect(numeric(target.objectId, "life")).toBe(2);
        if (mode === "own-response") sing();
        if (mode === "removed-choice")
          p.activate(reclaim, {
            reservePayment: pay(2),
            targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
          });
        passEffectsStack(game);
        const harmonized = ["own-before", "own-response"].includes(mode);
        if (harmonized) {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          const snapshot = game.state;
          for (const ids of [
            [],
            [target.objectId],
            [p.card(automatonDrone).objectId],
            [p.card(champion).objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(snapshot);
          }
          answerDecision(game, "resolve-effect-choice", [
            p.card(woodlandSquirrels, { zone: "field" }).objectId,
          ]);
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(numeric(target.objectId, "life")).toBe(5);
        expect(numeric(target.objectId, "power")).toBe(2);
        const buffed = p.cards(woodlandSquirrels, { zone: "field" })[0];
        if (buffed) {
          expect(numeric(buffed.objectId, "life")).toBe(harmonized ? 3 : 1);
          expect(numeric(buffed.objectId, "power")).toBe(harmonized ? 3 : 1);
        }
        const protectedState = game.state;
        expect(() =>
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(4),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(protectedState);
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(4),
          targets: { "target-1": [q.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
        advanceToMain(game, p.id, game.state.turn.number);
        expect(numeric(target.objectId, "life")).toBe(2);
        if (buffed) expect(numeric(buffed.objectId, "life")).toBe(harmonized ? 3 : 1);
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(4),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        expect(p.card(anthemOfVitality, { zone: "graveyard" })).toBeDefined();
      });
    }
});
