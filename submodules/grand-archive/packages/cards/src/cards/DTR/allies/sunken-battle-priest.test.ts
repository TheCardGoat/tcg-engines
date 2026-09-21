import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sunkenBattlePriest } from "./sunken-battle-priest.ts";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import { chillingTouch } from "../../DOA/actions/chilling-touch.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers sm68d3we64-a1 @covers sm68d3we64-a2 */
describe("Sunken Battle Priest — paid Ephemerate and restricted dynamic power", () => {
  for (const matching of [false, true])
    for (const ephemerate of [false, true])
      it(`pays both costs and buffs only other controlled ephemeral allies, class=${matching}, ephemerate=${ephemerate}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(sunkenBattlePriest, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [evercurrentRaider],
              hand: [
                ...(ephemerate ? [] : [sunkenBattlePriest]),
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              graveyard: [
                chillingTouch,
                woodlandSquirrels,
                evercurrentRaider,
                evercurrentRaider,
                ...(ephemerate ? [sunkenBattlePriest] : []),
              ],
              banishment: [chillingTouch],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [threeOfSpades, woodlandSquirrels],
              hand: [woodlandSquirrels, woodlandSquirrels],
              graveyard: [evercurrentRaider, chillingTouch],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const enemy = q.card(evercurrentRaider);
        q.activate(enemy, {
          activationMethod: "ephemerate",
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const regular = p.card(evercurrentRaider, { zone: "field" });
        const allies = p.cards(evercurrentRaider, { zone: "graveyard" });
        p.activate(allies[0]!, { activationMethod: "ephemerate", reservePayment: payment(2) });
        passEffectsStack(game);
        const source = p.card(sunkenBattlePriest),
          fuel = p.card(chillingTouch, { zone: "graveyard" });
        if (ephemerate) {
          for (const selection of [
            [],
            [q.card(chillingTouch).objectId],
            [p.card(chillingTouch, { zone: "banishment" }).objectId],
            [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(source, {
                activationMethod: "ephemerate",
                reservePayment: payment(3),
                costSelections: [selection],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
        }
        const before = game.state;
        expect(() =>
          p.activate(source, {
            activationMethod: ephemerate ? "ephemerate" : undefined,
            reservePayment: payment(2),
            ...(ephemerate ? { costSelections: [[fuel.objectId]] } : {}),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, {
          activationMethod: ephemerate ? "ephemerate" : undefined,
          reservePayment: payment(3),
          ...(ephemerate ? { costSelections: [[fuel.objectId]] } : {}),
        });
        expect(game.state.objects[fuel.objectId]!.zone).toBe(
          ephemerate ? "banishment" : "graveyard",
        );
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
        p.activate(allies[1]!, { activationMethod: "ephemerate", reservePayment: payment(2) });
        passEffectsStack(game);
        let total = 0;
        for (const attacker of [source, regular, ...allies]) {
          p.declareAttack(attacker, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          total += allies.some((a) => a.objectId === attacker.objectId) && matching ? 2 : 1;
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
        }
        advanceToMain(game, q.id);
        q.declareAttack(enemy, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
        for (const attacker of [
          q.card(threeOfSpades),
          q.card(woodlandSquirrels, { zone: "field" }),
        ]) {
          q.declareAttack(attacker, source);
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(
          ephemerate ? "banishment" : "graveyard",
        );
        advanceToMain(game, p.id);
        for (const attacker of allies) {
          p.declareAttack(attacker, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(++total);
        }
      });
});
