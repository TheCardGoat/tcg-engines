import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { spiritsBlessing } from "./spirits-blessing.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { excaliburCursedSword } from "../weapons/excalibur-cursed-sword.ts";
/** @covers qaA3sXFRFY-a1 */
describe("Spirit's Blessing returns controlled regalia to its owner as a cost, wakes, and draws", () => {
  for (const borrowed of [false, true])
    for (const rested of [false, true])
      it(`borrowed=${borrowed}, rested=${rested}`, () => {
        const champion = createClassBonusTestChampion(spiritsBlessing, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                hand: [spiritsBlessing, woodlandSquirrels],
                field: [trainingSword, woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                "material-deck": [excaliburCursedSword],
                field: [trainingSword],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.materialize(excaliburCursedSword);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [borrowed ? p.id : q.id]);
        passEffectsStack(game);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        const source = borrowed ? q.card(excaliburCursedSword) : p.card(trainingSword),
          hero = p.card(champion),
          foe = q.card(champion),
          top = p.zone("main-deck")[0]!,
          pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 1)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (rested) {
          p.declareAttack(hero, foe, { weaponIds: [source.objectId] });
          game.resolveCombatWithoutRetaliation();
        }
        const before = game.state;
        for (const bad of [
          q.card(trainingSword),
          p.card(woodlandSquirrels, { zone: "field" }),
          hero,
        ]) {
          expect(() =>
            p.activate(spiritsBlessing, { reservePayment: pay, costSelections: [[bad.objectId]] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() => p.activate(spiritsBlessing, { reservePayment: pay })).toThrow();
        expect(game.state).toEqual(before);
        const hand = p.zone("hand").length;
        p.activate(spiritsBlessing, { reservePayment: pay, costSelections: [[source.objectId]] });
        expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
        expect((borrowed ? q : p).zone("material-deck").map((c) => c.objectId)).toContain(
          source.objectId,
        );
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(rested);
        expect(p.zone("hand")).toHaveLength(hand - 2);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
        expect(p.zone("hand")).toHaveLength(hand - 1);
        expect(game.state.objects[top.objectId]!.zone).toBe("hand");
        expect(game.state.objects[source.objectId]!.ownerId).toBe(borrowed ? q.id : p.id);
      });
});
