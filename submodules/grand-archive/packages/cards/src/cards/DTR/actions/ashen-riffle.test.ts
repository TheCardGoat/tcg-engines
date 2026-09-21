import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { ashenRiffle } from "./ashen-riffle.ts";
import { threeOfSpades } from "../allies/three-of-spades.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers fjpimrl974-a1 */
describe("Ashen Riffle — reveal, select, order and activate independent banished cards", () => {
  for (const size of [0, 2, 4, 7])
    for (const selectedCount of [0, 1, 2]) run(size, selectedCount, "normal");
  run(7, 2, "later");
  run(7, 2, "rebanish");
  run(4, 2, "mixed");
  function run(
    size: number,
    selectedCount: number,
    mode: "normal" | "later" | "rebanish" | "mixed",
  ) {
    it(`deck=${size}, selected=${selectedCount}, mode=${mode}`, () => {
      const champion = createClassBonusTestChampion(ashenRiffle, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [ashenRiffle, ...Array.from({ length: 9 }, () => woodlandSquirrels)],
            banishment: [threeOfSpades],
            graveyard: [threeOfSpades],
            "main-deck":
              mode === "mixed"
                ? [threeOfSpades, threeOfSpades, ashenRiffle, woodlandSquirrels]
                : Array.from({ length: size }, () => threeOfSpades),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [enfeebledDagger, enfeebledDagger],
            hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
            banishment: [threeOfSpades],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const deck = p.zone("main-deck").map((c) => c.objectId),
        revealed = deck.slice(0, 4);
      const eligible = revealed.filter(
        (id) => game.state.objects[id]!.definitionId === threeOfSpades.canonicalId,
      );
      const selected = eligible.slice(0, selectedCount),
        remainder = revealed.filter((id) => !selected.includes(id)).reverse();
      const unrelated = p.card(threeOfSpades, { zone: "banishment" });
      const before = game.state;
      expect(() => p.activate(ashenRiffle, { reservePayment: payment(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(ashenRiffle, { reservePayment: payment(2) });
      expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
      passEffectsStack(game);
      expect(
        game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
      ).toEqual(revealed);
      if (eligible.length) {
        const snapshot = game.state;
        for (const invalid of [
          [unrelated.objectId],
          [q.card(threeOfSpades).objectId],
          [p.card(threeOfSpades, { zone: "graveyard" }).objectId],
          [eligible[0]!, eligible[0]!],
          ...(eligible.length > 2 ? [eligible.slice(0, 3)] : []),
          ...revealed.filter((id) => !eligible.includes(id)).map((id) => [id]),
          ...(deck.length > 4 ? [[deck[4]!]] : []),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(snapshot);
        }
        answerDecision(game, "resolve-effect-choice", selected);
        passEffectsStack(game);
      }
      if (remainder.length > 1) {
        const snapshot = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", remainder.slice(1))).toThrow();
        expect(game.state).toEqual(snapshot);
        answerDecision(game, "resolve-effect-choice", remainder);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
        ...deck.slice(revealed.length),
        ...remainder,
      ]);
      for (const id of selected) expect(game.state.objects[id]!.zone).toBe("banishment");
      expect(p.cards(ashenRiffle, { zone: "graveyard" })).toHaveLength(1);
      const denied = game.state;
      expect(() => p.activate(unrelated, { reservePayment: payment(3) })).toThrow();
      expect(game.state).toEqual(denied);
      if (mode === "later") {
        advanceToMain(game, q.id);
        q.pass();
        const offTurn = game.state;
        expect(() =>
          p.activate(
            p.cards(threeOfSpades, { zone: "banishment" }).find((c) => c.objectId === selected[0])!,
            { reservePayment: payment(3) },
          ),
        ).toThrow();
        expect(game.state).toEqual(offTurn);
        advanceToMain(game, p.id);
      }
      for (const [index, id] of selected.entries()) {
        const card = p.cards(threeOfSpades, { zone: "banishment" }).find((c) => c.objectId === id)!;
        const unpaid = game.state;
        expect(() => p.activate(card, { reservePayment: payment(2) })).toThrow();
        expect(game.state).toEqual(unpaid);
        p.activate(card, { reservePayment: payment(3) });
        passEffectsStack(game);
        expect(game.state.objects[id]!.zone).toBe("field");
        if (mode === "rebanish" && index === 0) {
          for (const dagger of q.cards(enfeebledDagger)) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
            q.activateAbility(dagger, "idpdon8f0h-a1", { targets: { "target-unit": [id] } });
            passEffectsStack(game);
          }
          expect(game.state.objects[id]!.zone).toBe("graveyard");
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          q.activate(tombSweep, {
            targets: { "target-card": [id] },
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[id]!.zone).toBe("banishment");
          const snapshot = game.state;
          expect(() => p.activate(card, { reservePayment: payment(3) })).toThrow();
          expect(game.state).toEqual(snapshot);
        }
      }
    });
  }
});
