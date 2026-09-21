import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aquiferSeneschal } from "./aquifer-seneschal.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 8mrn8at13c-a2 @covers 8mrn8at13c-a3 */
describe("Aquifer Seneschal — omen thresholds and conditional Taunt", () => {
  for (const matching of [false, true])
    for (const count of [0, 2, 3, 5, 6])
      it(`wakes at three, buffs at six, and Taunts only while awake and class-matched: class=${matching}, omens=${count}`, () => {
        const champion = createClassBonusTestChampion(
          aquiferSeneschal,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [
                aquiferSeneschal,
                ...Array.from({ length: 3 * count + 3 }, () => woodlandSquirrels),
              ],
              field: Array.from({ length: count }, () => condemnedTrinket),
              graveyard: Array.from({ length: count + 1 }, () => woodlandSquirrels),
              banishment: [woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [condemnedTrinket, giantTortoise, giantTortoise],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.activateAbility(q.card(condemnedTrinket), "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          q.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
        ]);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const payment = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const trinket of p.cards(condemnedTrinket, { zone: "field" })) {
          p.activateAbility(trinket, "21oy1nd4nw-a1", { reservePayment: payment() });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [
            p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
          ]);
          passEffectsStack(game);
        }
        const source = p.card(aquiferSeneschal);
        p.activate(source, { reservePayment: payment() });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(count < 3);
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(count >= 6 ? 1 : 0);
        advanceToMain(game, q.id);
        const attackers = q.cards(giantTortoise);
        if (matching && count >= 3) {
          const before = game.state;
          expect(() => q.declareAttack(attackers[0]!, p.card(champion))).toThrow();
          expect(game.state).toEqual(before);
          q.declareAttack(attackers[0]!, source);
        } else q.declareAttack(attackers[0]!, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        q.declareAttack(attackers[1]!, source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[source.objectId]!.damage).toBe(matching && count >= 3 ? 2 : 1);
        advanceToMain(game, p.id);
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(count >= 6 ? 4 : 3);
        advanceToMain(game, q.id);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        const damage = game.state.objects[p.card(champion).objectId]!.damage;
        q.declareAttack(attackers[0]!, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(damage + 1);
      });
});
