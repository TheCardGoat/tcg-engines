import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { pristineScourge } from "./pristine-scourge.ts";
import { backdash } from "./backdash.ts";
import { intensifiedPyre } from "./intensified-pyre.ts";
import { extortingBlackjack } from "../attacks/extorting-blackjack.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
function prepare(omens: readonly Card[], memoryCount: number, ciel = false, opposing = false) {
  const champion = createLineageTestChampion(pristineScourge, ciel ? "Ciel" : "Other");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposing ? "playerTwo" : "playerOne",
    playerOne: {
      champion,
      zones: {
        field: Array.from({ length: omens.length + 1 }, () => condemnedTrinket),
        hand: [
          pristineScourge,
          ...Array.from({ length: 9 + 3 * omens.length }, () => woodlandSquirrels),
        ],
        graveyard: [...omens, intensifiedPyre, pristineScourge],
        banishment: [
          woodlandSquirrels,
          backdash,
          extortingBlackjack,
          intensifiedPyre,
          giantTortoise,
          pristineScourge,
        ],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: createLineageTestChampion(pristineScourge, "Ciel"),
      zones: {
        field: opposing ? [condemnedTrinket, condemnedTrinket] : [],
        hand: Array.from({ length: 7 }, () => woodlandSquirrels),
        memory: [giantTortoise, backdash, woodlandSquirrels].slice(0, memoryCount),
        graveyard: [woodlandSquirrels, backdash, giantTortoise],
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
  if (opposing) {
    for (const card of [woodlandSquirrels, backdash]) {
      const selected = q.card(card, { zone: "graveyard" });
      q.activateAbility(q.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision) {
        answerDecision(game, "resolve-effect-choice", [selected.objectId]);
        passEffectsStack(game);
      }
    }
    advanceToMain(game, p.id);
  }
  for (const card of omens) {
    const selected = p.cards(card, { zone: "graveyard" })[0]!;
    p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
      reservePayment: payment(3),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [selected.objectId]);
    passEffectsStack(game);
  }
  return { game, p, q, payment };
}
function resolveDiscard(game: GrandArchiveTestEngine, expectedCount: number) {
  const p = game.player("player-one"),
    q = game.player("player-two");
  const memory = q.zone("memory").map((c) => c.objectId),
    hand = q.zone("hand"),
    ownHand = p.zone("hand"),
    ownMemory = p.zone("memory");
  expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
  passEffectsStack(game);
  const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
  expect(looks).toHaveLength(memory.length ? 1 : 0);
  if (looks.length)
    expect(looks[0]).toMatchObject({ playerId: p.id, actorId: p.id, objectIds: memory });
  for (let step = 0; step < 2 && game.state.decision; step++) {
    expect(game.state.decision.playerId).toBe(p.id);
    const decision = game.state.decision,
      snapshot = game.state;
    expect(() =>
      q.execute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [q.zone("memory")[0]!.objectId],
      }),
    ).toThrow();
    expect(game.state).toEqual(snapshot);

    const invalids = [
      [ownHand[0]!.objectId],
      [ownMemory[0]!.objectId],
      [q.zone("hand")[0]!.objectId],
      [q.zone("graveyard")[0]!.objectId],
      [],
      q.zone("memory").map((c) => c.objectId),
    ];
    for (const invalid of invalids) {
      if (invalid.length === 1 && q.zone("memory").some((c) => c.objectId === invalid[0])) continue;
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
      expect(game.state).toEqual(before);
    }
    const selected = q.zone("memory")[0]!;
    answerDecision(game, "resolve-effect-choice", [selected.objectId]);
    passEffectsStack(game);
  }
  expect(game.state.decision).toBeFalsy();
  expect(game.state.stack).toHaveLength(0);
  expect(q.zone("memory")).toHaveLength(memory.length - expectedCount);
  expect(memory.filter((id) => game.state.objects[id]!.zone === "graveyard")).toHaveLength(
    expectedCount,
  );
  expect(p.zone("hand")).toEqual(ownHand);
  expect(p.zone("memory")).toEqual(ownMemory);
  expect(q.zone("hand")).toEqual(hand);
  expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
  expect(p.cards(pristineScourge, { zone: "graveyard" })).toHaveLength(2);
}
/** @covers kugriwszxr-a1 */
describe("Pristine Scourge — capped Ciel discount", () => {
  for (const ciel of [false, true])
    for (const count of [0, 1, 2, 3])
      it(`Ciel=${ciel}, owned omens=${count}`, () => {
        const { game, p, q, payment } = prepare(
          Array.from({ length: count }, () => backdash),
          3,
          ciel,
          true,
        );
        const cost = 5 - (ciel ? Math.min(2, count) : 0),
          before = game.state;
        expect(() =>
          p.activate(p.card(pristineScourge, { zone: "hand" }), {
            targets: { "target-opponent": [q.id] },
            reservePayment: payment(cost - 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const memory = p.zone("memory").length;
        p.activate(p.card(pristineScourge, { zone: "hand" }), {
          targets: { "target-opponent": [q.id] },
          reservePayment: payment(cost),
        });
        expect(p.zone("memory")).toHaveLength(memory + cost);
        resolveDiscard(game, 1);
      });
});
/** @covers kugriwszxr-a2 */
describe("Pristine Scourge — inspect and choose opposing memory discards", () => {
  const four = [woodlandSquirrels, backdash, extortingBlackjack, giantTortoise];
  for (const scenario of [
    { name: "none", omens: [], discard: 1 },
    { name: "four distinct", omens: four, discard: 1 },
    { name: "five distinct", omens: [...four, pristineScourge], discard: 2 },
    { name: "six distinct", omens: [...four, pristineScourge, intensifiedPyre], discard: 2 },
    { name: "five omens with only four costs", omens: [...four, backdash], discard: 1 },
    {
      name: "duplicates with five distinct costs",
      omens: [...four, pristineScourge, backdash, backdash],
      discard: 2,
    },
  ])
    for (const memory of [0, 1, 3])
      it(`${scenario.name}, memory=${memory}`, () => {
        const { game, p, q, payment } = prepare(scenario.omens, memory);
        const source = p.card(pristineScourge, { zone: "hand" });
        for (const targets of [[p.id], [q.zone("field")[0]!.objectId], [p.id, q.id]]) {
          const before = game.state;
          expect(() =>
            p.activate(source, {
              targets: { "target-opponent": targets },
              reservePayment: payment(5),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { targets: { "target-opponent": [q.id] }, reservePayment: payment(5) });
        expect(q.zone("memory")).toHaveLength(memory);
        resolveDiscard(game, Math.min(memory, scenario.discard));
      });
  it("checks the fifth distinct omen after a response, rather than at activation", () => {
    const { game, p, q, payment } = prepare(four, 3);
    p.activate(p.card(pristineScourge, { zone: "hand" }), {
      targets: { "target-opponent": [q.id] },
      reservePayment: payment(5),
    });
    p.activateAbility(p.card(condemnedTrinket, { zone: "field" }), "21oy1nd4nw-a1", {
      reservePayment: payment(3),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [
      p.card(intensifiedPyre, { zone: "graveyard" }).objectId,
    ]);
    resolveDiscard(game, 2);
  });
});
