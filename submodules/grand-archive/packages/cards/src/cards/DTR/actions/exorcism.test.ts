import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { exorcism } from "./exorcism.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 4n6dd4f01r-a1 */
describe("Exorcism — each controller pays for each ephemeral object", () => {
  for (const count of [0, 1, 2])
    for (const policy of ["none", "both", "caster", "opponent", "unaffordable"] as const)
      it(`${count} ephemeral objects per player, payments=${policy}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(exorcism, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [exorcism, ...Array.from({ length: 3 + 3 * count }, () => woodlandSquirrels)],
              graveyard: Array.from({ length: count + 1 }, () => evercurrentRaider),
              field: [evercurrentRaider, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: Array.from(
                { length: (policy === "unaffordable" ? 2 : 3) * count },
                () => woodlandSquirrels,
              ),
              graveyard: Array.from({ length: count + 1 }, () => evercurrentRaider),
              field: [evercurrentRaider, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (player: typeof p, amount: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const regular = [
          p.card(evercurrentRaider, { zone: "field" }).objectId,
          q.card(evercurrentRaider, { zone: "field" }).objectId,
        ];
        const opposing = q.cards(evercurrentRaider, { zone: "graveyard" }).slice(0, count);
        const own = p.cards(evercurrentRaider, { zone: "graveyard" }).slice(0, count);
        for (const card of opposing) {
          q.activate(card, { activationMethod: "ephemerate", reservePayment: payment(q, 2) });
          passEffectsStack(game);
        }
        q.pass();
        const offTurn = game.state;
        expect(() => p.activate(exorcism, { reservePayment: payment(p, 3) })).toThrow();
        expect(game.state).toEqual(offTurn);
        advanceToMain(game, p.id);
        for (const card of own) {
          p.activate(card, { activationMethod: "ephemerate", reservePayment: payment(p, 2) });
          passEffectsStack(game);
        }
        for (const card of [...own, ...opposing])
          expect(game.state.objects[card.objectId]!.states.has("ephemeral")).toBe(true);
        const initial = game.state;
        expect(() => p.activate(exorcism, { reservePayment: payment(p, 2) })).toThrow();
        expect(game.state).toEqual(initial);
        const memoryBefore = [p.zone("memory").length, q.zone("memory").length];
        p.activate(exorcism, { reservePayment: payment(p, 3) });
        for (const card of [...own, ...opposing])
          expect(game.state.objects[card.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        const decisions = { "player-one": 0, "player-two": 0 };
        const paid = { "player-one": 0, "player-two": 0 };
        for (let step = 0; game.state.decision && step < 8; step++) {
          const decision = game.state.decision;
          expect(decision.kind).toBe("resolve-effect-payment");
          const payer = game.player(decision.playerId);
          const isCaster = payer.id === p.id;
          const key = isCaster ? "player-one" : "player-two";
          decisions[key]++;
          const pay =
            policy === "both" ||
            (policy === "caster" && isCaster) ||
            (policy === "opponent" && !isCaster);
          const snapshot = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: [] }),
          ).toThrow();
          expect(game.state).toEqual(snapshot);
          const other = isCaster ? q : p;
          const foreign = other.zone("hand")[0] ?? other.zone("memory")[0];
          if (foreign) {
            expect(() =>
              answerDecision(game, "resolve-effect-payment", {
                reservePayment: [{ kind: "card", cardId: foreign.objectId }],
              }),
            ).toThrow();
            expect(game.state).toEqual(snapshot);
          }
          if (pay) {
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment(payer, 1) });
            paid[key]++;
          } else answerDecision(game, "resolve-effect-payment", false);
          passEffectsStack(game);
        }
        expect(decisions).toEqual({ "player-one": count, "player-two": count });
        for (const [cards, key] of [
          [own, "player-one"],
          [opposing, "player-two"],
        ] as const)
          for (const card of cards)
            expect(game.state.objects[card.objectId]!.zone).toBe(
              paid[key] ? "field" : "banishment",
            );
        for (const id of regular) expect(game.state.objects[id]!.zone).toBe("field");
        expect(p.cards(evercurrentRaider, { zone: "graveyard" })).toHaveLength(1);
        expect(q.cards(evercurrentRaider, { zone: "graveyard" })).toHaveLength(1);
        expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
        expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
        expect(p.zone("memory")).toHaveLength(memoryBefore[0]! + 3 + paid["player-one"]);
        expect(q.zone("memory")).toHaveLength(memoryBefore[1]! + paid["player-two"]);
        expect(p.cards(exorcism, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
      });
});
