import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { pendantOfAccrual } from "./pendant-of-accrual.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";

/** @covers WUhbG91eRa-a1 @covers WUhbG91eRa-a2 */
describe("Pendant of Accrual's opponent payment and debt draw", () => {
  for (const matching of [false, true])
    for (const paidFirst of [false, true])
      for (const ownTurn of [false, true])
        it(`collects debt only on refusal and spends two for a memory draw: class=${matching}, paid=${paidFirst}, own=${ownTurn}`, () => {
          const champion = createClassBonusTestChampion(
            pendantOfAccrual,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [pendantOfAccrual],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: Array.from({ length: 3 }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(pendantOfAccrual);
          const debt = () => game.state.objects[source.objectId]!.counters["named:debt"] ?? 0;
          const before = game.state;
          expect(() => p.activateAbility(source, "WUhbG91eRa-a2")).toThrow();
          expect(game.state).toEqual(before);
          const recollect = (pay: boolean) => {
            const previous = debt();
            advanceToRecollection(game, q.id);
            expect(debt()).toBe(previous);
            expect(game.state.stack).toHaveLength(1);
            passEffectsStack(game);
            expect(game.state.decision).toMatchObject({
              kind: "resolve-optional-effect",
              playerId: q.id,
            });
            answerDecision(game, "resolve-optional-effect", pay);
            if (pay) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-payment",
                playerId: q.id,
              });
              const payment = q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              const snapshot = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-payment", {
                  reservePayment: payment.slice(0, 1),
                }),
              ).toThrow();
              expect(game.state).toEqual(snapshot);
              answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
              expect(q.zone("memory")).toHaveLength(2);
            }
            passEffectsStack(game);
            expect(debt()).toBe(previous + Number(!pay));
          };
          if (paidFirst) recollect(true);
          for (let n = 0; n < 4; n++) {
            recollect(false);
            if (n === 0) {
              q.pass();
              const snapshot = game.state;
              expect(() => p.activateAbility(source, "WUhbG91eRa-a2")).toThrow();
              expect(game.state).toEqual(snapshot);
            }
          }
          if (ownTurn) advanceToMain(game, p.id);
          else q.pass();
          expect(debt()).toBe(4);
          const draw = () => {
            const previous = debt(),
              hand = p.zone("hand").map((c) => c.objectId),
              memory = p.zone("memory").map((c) => c.objectId),
              deck = p.zone("main-deck").map((c) => c.objectId);
            p.activateAbility(source, "WUhbG91eRa-a2");
            expect(debt()).toBe(previous - 2);
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
            expect(p.zone("memory").map((c) => c.objectId)).toEqual(memory);
            const snapshot = game.state;
            expect(() => p.activateAbility(source, "WUhbG91eRa-a2")).toThrow();
            expect(game.state).toEqual(snapshot);
            passEffectsStack(game);
            expect(p.zone("hand").map((c) => c.objectId)).toEqual(hand);
            expect(p.zone("memory").map((c) => c.objectId)).toEqual([...memory, deck[0]!]);
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
          };
          draw();
          if (ownTurn) recollect(false);
          advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          draw();
        });
});

for (const handSize of [0, 1])
  it(`cannot fund the beginning-of-recollection payment from unrecollected memory: hand=${handSize}`, () => {
    const champion = createClassBonusTestChampion(pendantOfAccrual, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [pendantOfAccrual], "main-deck": [woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: {
          hand: Array.from({ length: handSize }, () => woodlandSquirrels),
          memory: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(pendantOfAccrual);
    advanceToRecollection(game, q.id);
    expect(q.zone("memory")).toHaveLength(2);
    expect(q.zone("hand")).toHaveLength(handSize);
    passEffectsStack(game);
    expect(game.state.decision).toMatchObject({ kind: "resolve-optional-effect", playerId: q.id });
    const before = game.state;
    expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.counters["named:debt"]).toBe(1);
    expect(q.zone("memory")).toHaveLength(2);
    advanceToMain(game, q.id);
    expect(q.zone("memory")).toHaveLength(0);
    expect(q.zone("hand")).toHaveLength(handSize + 3);
  });
