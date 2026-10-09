import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { flowerbud } from "../cards/HVN/tokens/flowerbud.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveBloomFlowerbudReplacement(card: Card, flowers: readonly [Card, Card]) {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const reserveCost = cost.amount;
  for (const matching of [false, true])
    for (const count of [0, 1, 3])
      for (const first of [0, 1])
        it(`replaces opposing Flowerbuds: class=${matching}, count=${count}, first choice=${first}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: flowers,
            playerOne: {
              champion,
              zones: {
                field: [flowerbud, flowerbud, flowers[0]],
                hand: [card, ...Array.from({ length: reserveCost }, () => woodlandSquirrels)],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [
                  ...Array.from({ length: count }, () => flowerbud),
                  flowers[1],
                  woodlandSquirrels,
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const ownField = p.zone("field"),
            oldBuds = q.cards(flowerbud, { zone: "field" });
          const oldFlowers = flowers.map((flower) => q.cards(flower, { zone: "field" }));
          const other = q.card(woodlandSquirrels, { zone: "field" });
          p.activate(card, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          expect(q.cards(flowerbud, { zone: "field" })).toEqual(oldBuds);
          passEffectsStack(game);
          const expected = [0, 0];
          for (let i = 0; i < (matching ? count : 0); i++) {
            expect(q.cards(flowerbud, { zone: "field" })).toHaveLength(0);
            const decision = game.state.decision;
            if (decision?.kind !== "resolve-effect-choice")
              throw new Error("Expected Bloom token choice");
            expect(decision.playerId).toBe(p.id);
            expect(decision.selection.candidates).toEqual({
              kind: "option",
              options: flowers.map((flower) => grandArchiveTestFace(flower).name),
            });
            const before = game.state;
            expect(() =>
              q.execute({
                move: "answer-decision",
                decisionId: decision.id,
                stateVersion: decision.stateVersion,
                answer: grandArchiveTestFace(flowers[0]).name,
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            expect(() => answerDecision(game, "resolve-effect-choice", "Flowerbud")).toThrow();
            expect(game.state).toEqual(before);
            const choice = (first + i) % 2;
            answerDecision(
              game,
              "resolve-effect-choice",
              grandArchiveTestFace(flowers[choice]!).name,
            );
            expected[choice]!++;
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(q.cards(flowerbud, { zone: "field" })).toHaveLength(matching ? 0 : count);
          expect(p.zone("field")).toEqual(ownField);
          expect(q.card(woodlandSquirrels, { zone: "field" })).toEqual(other);
          for (let index = 0; index < 2; index++) {
            const after = q.cards(flowers[index]!, { zone: "field" });
            expect(after).toHaveLength(oldFlowers[index]!.length + expected[index]!);
            expect(after).toEqual(expect.arrayContaining([...oldFlowers[index]!]));
            for (const ref of after.filter(
              (ref) => !oldFlowers[index]!.some((old) => old.objectId === ref.objectId),
            ))
              expect(game.state.objects[ref.objectId]).toMatchObject({
                ownerId: q.id,
                controllerId: q.id,
                isToken: true,
                zone: "field",
              });
          }
          expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        });
}

import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { blossomingDenial } from "../cards/P25/actions/blossoming-denial.ts";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import { advanceToMain } from "./decisions.ts";

export function proveBloomEveryOpponent(card: Card, flowers: readonly [Card, Card]) {
  it("replaces two Flowerbuds for each of two opponents, with all choices made by the caster", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, true, "activation-discount"),
    );
    const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      startingChampionDefinitionId: champion.canonicalId,
      mainDeck: [card, blossomingDenial, woodlandSquirrels].map((definition) => ({
        definitionId: definition.canonicalId,
        count: 40,
      })),
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      pantheon: {
        lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
        greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
        barrierDefinitionId: pantheonBarrier.canonicalId,
      },
    });
    const game = GrandArchiveTestEngine.start(
      [
        champion,
        card,
        blossomingDenial,
        woodlandSquirrels,
        flowerbud,
        ...flowers,
        lesserBoonOfApollo,
        greaterBoonOfHorses,
        pantheonBarrier,
      ],
      {
        mode: "pantheon",
        firstPlayerId: "player-one",
        randomSeed: 43,
        players: [setup("player-one"), setup("player-two"), setup("player-three")],
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p = game.player("player-one"),
      opponents = [game.player("player-two"), game.player("player-three")];
    for (let turn = 0; turn < 10; turn++) advanceToMain(game, p.id, game.state.turn.number);
    const bloom = p.cards(card, { zone: "hand" })[0]!;
    const denial = p.cards(blossomingDenial, { zone: "hand" })[0]!;
    const pay = (count: number) =>
      p
        .zone("hand")
        .filter((ref) => ref.objectId !== bloom.objectId && ref.objectId !== denial.objectId)
        .slice(0, count)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
    p.activate(denial, {
      reservePayment: pay(3),
      targets: { "target-stack-item": [] },
    });
    passEffectsStack(game);
    for (const opponent of opponents)
      expect(opponent.cards(flowerbud, { zone: "field" })).toHaveLength(2);
    const ownField = p.zone("field");
    const cost = grandArchiveTestFace(card).cost;
    if (cost.kind !== "reserve" || typeof cost.amount !== "number")
      throw new Error("Expected fixed reserve cost");
    p.activate(bloom, { reservePayment: pay(cost.amount) });
    passEffectsStack(game);
    for (let choice = 0; choice < 4; choice++) {
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      expect(game.state.decision?.playerId).toBe(p.id);
      for (const opponent of opponents)
        expect(opponent.cards(flowerbud, { zone: "field" })).toHaveLength(0);
      answerDecision(game, "resolve-effect-choice", grandArchiveTestFace(flowers[0]).name);
      passEffectsStack(game);
    }
    expect(game.state.decision).toBeNull();
    expect(p.zone("field")).toEqual(ownField);
    for (const opponent of opponents) {
      expect(opponent.cards(flowers[1], { zone: "field" })).toHaveLength(0);
      const tokens = opponent.cards(flowers[0], { zone: "field" });
      expect(tokens).toHaveLength(2);
      for (const token of tokens)
        expect(game.state.objects[token.objectId]).toMatchObject({
          controllerId: opponent.id,
          ownerId: opponent.id,
          isToken: true,
        });
    }
  });
}
