import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lingeringBanshee } from "./lingering-banshee.ts";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers v0gu8efq08-a1 */
describe("Lingering Banshee — conditional Ephemerate cost", () => {
  for (const count of [0, 1, 2])
    for (const ephemerate of [false, true])
      it(`pays ${ephemerate ? (count ? 3 : 6) : 3} with ${count} owned ephemeral objects, ephemerate=${ephemerate}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(lingeringBanshee, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(ephemerate ? [] : [lingeringBanshee]),
                ...Array.from({ length: 6 + 2 * count }, () => woodlandSquirrels),
              ],
              graveyard: [
                ...(ephemerate ? [lingeringBanshee] : []),
                ...Array.from({ length: count }, () => evercurrentRaider),
              ],
              field: [evercurrentRaider],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [woodlandSquirrels, woodlandSquirrels],
              graveyard: [evercurrentRaider],
              field: [threeOfSpades, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.activate(q.card(evercurrentRaider), {
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
        for (const ally of p.cards(evercurrentRaider, { zone: "graveyard" })) {
          p.activate(ally, { activationMethod: "ephemerate", reservePayment: payment(2) });
          passEffectsStack(game);
        }
        const source = p.card(lingeringBanshee);
        const amount = ephemerate && !count ? 6 : 3;
        const method = ephemerate ? "ephemerate" : undefined;
        const before = game.state;
        expect(() =>
          p.activate(source, { activationMethod: method, reservePayment: payment(amount - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (ephemerate) {
          expect(() => p.activate(source, { reservePayment: payment(amount) })).toThrow();
          expect(game.state).toEqual(before);
        }
        const memory = p.zone("memory").length;
        p.activate(source, { activationMethod: method, reservePayment: payment(amount) });
        expect(p.zone("memory")).toHaveLength(memory + amount);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        advanceToMain(game, q.id);
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
      });
});
