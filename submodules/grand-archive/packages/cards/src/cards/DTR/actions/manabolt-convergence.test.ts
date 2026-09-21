import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { manaboltConvergence } from "./manabolt-convergence.ts";
import { resonantAether } from "./resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers smse0zjalx-a1 @covers smse0zjalx-a2 */
describe("Manabolt Convergence — one graveyard incarnation, paid activation, until end of turn", () => {
  for (const expire of [false, true])
    for (const load of [false, true])
      it(`grants bounded permission, expire=${expire}, load=${load}`, () => {
        const champion = createClassBonusTestChampion(
          manaboltConvergence,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword],
              hand: [
                manaboltConvergence,
                resonantAether,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              graveyard: [resonantAether, resonantAether, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream],
              graveyard: [resonantAether],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(manaboltConvergence),
          host = p.cards(trivariateDream)[1]!;
        const grave = p.cards(resonantAether, { zone: "graveyard" }),
          target = grave[0]!;
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [
          q.card(resonantAether),
          p.card(woodlandSquirrels, { zone: "graveyard" }),
          p.card(resonantAether, { zone: "hand" }),
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(source, {
              targets: { "target-card": [invalid.objectId] },
              reservePayment: payment(2),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const initial = game.state;
        expect(() => p.activate(target, { reservePayment: payment(1) })).toThrow();
        expect(game.state).toEqual(initial);
        p.activate(source, {
          targets: { "target-card": [target.objectId] },
          reservePayment: payment(2),
        });
        passEffectsStack(game);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        const unrelated = game.state;
        expect(() => p.activate(grave[1]!, { reservePayment: payment(1) })).toThrow();
        expect(game.state).toEqual(unrelated);
        if (expire) {
          advanceToMain(game, q.id);
          q.pass();
          const expired = game.state;
          expect(() => p.activate(target, { reservePayment: payment(1) })).toThrow();
          expect(game.state).toEqual(expired);
          p.activate(p.card(resonantAether, { zone: "hand" }), { reservePayment: payment(1) });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [host.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          return;
        }
        const unpaid = game.state;
        expect(() => p.activate(target, { reservePayment: [] })).toThrow();
        expect(game.state).toEqual(unpaid);
        p.activate(target, { reservePayment: payment(1) });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [host.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("loaded");
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(load ? 3 : 2);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        const newIncarnation = game.state;
        expect(() => p.activate(target, { reservePayment: payment(1) })).toThrow();
        expect(game.state).toEqual(newIncarnation);
      });
});
