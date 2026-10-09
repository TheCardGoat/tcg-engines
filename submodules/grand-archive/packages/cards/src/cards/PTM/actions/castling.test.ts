import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { castling } from "./castling.ts";
import { goldenRook } from "../allies/golden-rook.ts";
import { goldenBishop } from "../allies/golden-bishop.ts";
import { huntWeissKing } from "../allies/hunt-weiss-king.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers tFOpmUdi2W-a1 @covers tFOpmUdi2W-a2 */
describe("Castling — independent Chessman discounts", () => {
  for (const matching of [false, true])
    for (const mode of [
      "none",
      "rook",
      "king",
      "both",
      "two-rooks",
      "bishop",
      "opponent",
      "graveyard",
    ])
      it(`combines one Rook and one King discount: class=${matching}, mode=${mode}`, () => {
        const champion = createClassBonusTestChampion(castling, matching, "activation-discount");
        const own =
          mode === "rook"
            ? [goldenRook]
            : mode === "king"
              ? [huntWeissKing]
              : mode === "both"
                ? [goldenRook, huntWeissKing]
                : mode === "two-rooks"
                  ? [goldenRook, goldenRook]
                  : mode === "bishop"
                    ? [goldenBishop]
                    : [];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: own,
              graveyard: mode === "graveyard" ? [goldenRook, huntWeissKing] : [],
              hand: [castling, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: {
            champion,
            zones: { field: mode === "opponent" ? [goldenRook, huntWeissKing] : [] },
          },
        });
        const p = game.player("player-one");
        const cost = mode === "both" ? 0 : ["rook", "king", "two-rooks"].includes(mode) ? 2 : 4;
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        if (cost) {
          expect(() =>
            p.activate(castling, { reservePayment: pay(cost - 1), targets: { "target-1": [] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(castling, { reservePayment: pay(cost + 1), targets: { "target-1": [] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(castling, { reservePayment: pay(cost), targets: { "target-1": [] } });
        expect(p.zone("memory")).toHaveLength(cost);
        passEffectsStack(game);
        expect(p.cards(castling, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.decision).toBeNull();
      });
});

import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
/** @covers tFOpmUdi2W-a3 */
describe("Castling — selected Chessmen gain temporary protection", () => {
  for (const owner of ["own", "opponent", "split"])
    for (const count of [0, 1, 2])
      it(`protects only selected targets until end of turn: owner=${owner}, count=${count}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(castling, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [goldenRook, goldenRook],
              hand: [castling, sparkAlight, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [goldenRook, goldenRook, woodlandSquirrels],
              hand: [sparkAlight, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const own = p.cards(goldenRook, { zone: "field" }),
          opposing = q.cards(goldenRook, { zone: "field" });
        const selected = (
          owner === "own" ? own : owner === "opponent" ? opposing : [own[0]!, opposing[0]!]
        ).slice(0, count);
        const pay = (player: typeof p) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const life = (id: keyof typeof game.state.objects) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        q.pass();
        for (const invalid of [
          [q.card(woodlandSquirrels, { zone: "field" }).objectId],
          [p.card(champion).objectId],
          [own[0]!.objectId, own[0]!.objectId],
          [own[0]!.objectId, own[1]!.objectId, opposing[0]!.objectId],
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(castling, { reservePayment: pay(p), targets: { "target-1": invalid } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(castling, {
          reservePayment: pay(p),
          targets: { "target-1": selected.map((c) => c.objectId) },
        });
        for (const target of [...own, ...opposing]) expect(life(target.objectId)).toBe(4);
        passEffectsStack(game);
        for (const target of [...own, ...opposing])
          expect(life(target.objectId)).toBe(selected.includes(target) ? 6 : 4);
        for (const target of selected) {
          const before = game.state;
          expect(() =>
            q.activate(sparkAlight, {
              reservePayment: pay(q),
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const ownTaunt = selected.find((c) => own.includes(c));
        if (ownTaunt) {
          const before = game.state;
          expect(() => q.declareAttack(woodlandSquirrels, p.card(champion))).toThrow();
          expect(game.state).toEqual(before);
        }
        q.declareAttack(woodlandSquirrels, ownTaunt ?? p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[(ownTaunt ?? p.card(champion)).objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        for (const target of [...own, ...opposing]) expect(life(target.objectId)).toBe(4);
        const formerlyProtected = selected[0] ?? own[0]!;
        p.activate(sparkAlight, {
          reservePayment: pay(p),
          targets: { "target-1": [formerlyProtected.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[formerlyProtected.objectId]!.damage).toBe(2);
        // Opposing Taunt also expires: a direct attack on that champion is legal.
        p.declareAttack(own[1]!, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      });
});
