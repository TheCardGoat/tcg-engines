import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { duchessSixOfHearts } from "./duchess-six-of-hearts.ts";
import { twoOfHearts } from "./two-of-hearts.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import { fiveOfSpades } from "./five-of-spades.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers qzv380ujf5-a1 */
describe("Duchess — Kindle 6 activation payment", () => {
  for (const count of [0, 1, 5, 6])
    it(`uses ${count} fire graveyard cards`, () => {
      const champion = createClassBonusTestChampion(
        duchessSixOfHearts,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              duchessSixOfHearts,
              sparkAlight,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            graveyard: [woodlandSquirrels, ...Array.from({ length: 7 }, () => sparkAlight)],
            banishment: [sparkAlight],
          },
        },
        playerTwo: { champion, zones: { graveyard: [sparkAlight] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(duchessSixOfHearts);
      const fire = p.cards(sparkAlight, { zone: "graveyard" }).map((c) => c.objectId);
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const invalid of [
        [q.card(sparkAlight).objectId],
        [p.card(sparkAlight, { zone: "hand" }).objectId],
        [p.card(sparkAlight, { zone: "banishment" }).objectId],
        [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
        [fire[0]!, fire[0]!],
        fire,
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(source, {
            kindleCardIds: invalid,
            reservePayment: payment(Math.max(0, 6 - invalid.length)),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      if (count < 6) {
        const before = game.state;
        expect(() =>
          p.activate(source, {
            kindleCardIds: fire.slice(0, count),
            reservePayment: payment(5 - count),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(source, {
        kindleCardIds: fire.slice(0, count),
        reservePayment: payment(6 - count),
      });
      expect(p.zone("memory")).toHaveLength(6 - count);
      for (const [i, id] of fire.entries())
        expect(game.state.objects[id]!.zone).toBe(i < count ? "banishment" : "graveyard");
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      passEffectsStack(game);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
      if (count === 6) {
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(4) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(5) });
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", [fire[6]!]);
          passEffectsStack(game);
        }
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(5);
      }
    });
});

/** @covers qzv380ujf5-a2 */
describe("Duchess — Cardistry copies a small fire action once", () => {
  for (const variety of ["alone", "duplicates", "distinct"] as const)
    for (const choice of ["activate", "decline", "empty"] as const)
      it(`variety=${variety}, choice=${choice}`, () => {
        const champion = createClassBonusTestChampion(
          duchessSixOfHearts,
          false,
          "activation-discount",
        );
        const extras =
          variety === "alone"
            ? []
            : variety === "duplicates"
              ? [twoOfHearts, twoOfHearts]
              : [twoOfHearts, threeOfSpades, fiveOfSpades];
        const cost = variety === "alone" ? 5 : variety === "duplicates" ? 4 : 2;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [duchessSixOfHearts, woodlandSquirrels, ...extras],
              hand: [sparkAlight, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
              graveyard: [
                backdash,
                fireball,
                duchessSixOfHearts,
                ...(choice === "empty" ? [] : [sparkAlight, sparkAlight]),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [threeOfSpades, fiveOfSpades],
              graveyard: [sparkAlight],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(duchessSixOfHearts, { zone: "field" });
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(cost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(cost) });
        expect(p.zone("memory")).toHaveLength(cost);
        passEffectsStack(game);
        if (choice !== "empty") {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          const pending = game.state;
          for (const invalid of [
            p.card(backdash),
            p.card(fireball),
            p.card(duchessSixOfHearts, { zone: "graveyard" }),
            q.card(sparkAlight),
            p.card(sparkAlight, { zone: "hand" }),
          ]) {
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(pending);
          }
          const selected = p.cards(sparkAlight, { zone: "graveyard" })[0]!;
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", choice === "activate");
          passEffectsStack(game);
          if (choice === "activate") {
            expect(game.state.decision?.kind).toBe("announce-effect-activation");
            answerDecision(game, "announce-effect-activation", {
              targets: { "target-1": [q.card(champion).objectId] },
            });
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
            passEffectsStack(game);
          }
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(1);
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        expect(p.cards(sparkAlight)).toHaveLength(choice === "empty" ? 1 : 3);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          choice === "activate" ? 2 : 0,
        );
        expect(p.zone("memory")).toHaveLength(cost);
        const used = game.state;
        expect(() =>
          p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(cost) }),
        ).toThrow();
        expect(game.state).toEqual(used);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        const next = game.state;
        expect(() =>
          p.activateAbility(source, "qzv380ujf5-a2", { reservePayment: payment(cost) }),
        ).toThrow();
        expect(game.state).toEqual(next);
      });
});
