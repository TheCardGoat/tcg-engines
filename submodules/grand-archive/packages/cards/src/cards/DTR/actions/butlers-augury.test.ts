import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { butlersAugury } from "./butlers-augury.ts";
import { intensifiedPyre } from "./intensified-pyre.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { backdash } from "./backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 5u5ic64930-a1 */
describe("Butler's Augury — capped owned-omen discount", () => {
  for (const ciel of [false, true])
    for (const count of [0, 1, 2, 3])
      it(`Ciel=${ciel}, owned omens=${count}`, () => {
        const champion = createLineageTestChampion(butlersAugury, ciel ? "Ciel" : "Other");
        const opponent = createLineageTestChampion(butlersAugury, "Ciel");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => condemnedTrinket),
              hand: [
                butlersAugury,
                ...Array.from({ length: 3 * count + 4 }, () => woodlandSquirrels),
              ],
              graveyard: [...Array.from({ length: count }, () => backdash), woodlandSquirrels],
              banishment: [backdash, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [condemnedTrinket, condemnedTrinket],
              hand: Array.from({ length: 6 }, () => woodlandSquirrels),
              graveyard: [backdash, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (player: typeof p, n: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        for (let i = 0; i < 2; i++) {
          q.activateAbility(q.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(q, 3),
          });
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-effect-choice") {
            answerDecision(game, "resolve-effect-choice", [
              q.cards(backdash, { zone: "graveyard" })[0]!.objectId,
            ]);
            passEffectsStack(game);
          }
        }
        advanceToMain(game, p.id);
        for (let i = 0; i < count; i++) {
          const selected = p.cards(backdash, { zone: "graveyard" })[0]!;
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(p, 3),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        }
        const cost = 4 - (ciel ? Math.min(2, count) : 0),
          before = game.state;
        expect(() => p.activate(butlersAugury, { reservePayment: payment(p, cost - 1) })).toThrow();
        expect(game.state).toEqual(before);
        const memory = p.zone("memory").length,
          hand = p.zone("hand").length;
        p.activate(butlersAugury, { reservePayment: payment(p, cost) });
        expect(p.zone("memory")).toHaveLength(memory + cost);
        expect(p.zone("hand")).toHaveLength(hand - cost - 1);
        passEffectsStack(game);
        expect(p.cards(butlersAugury, { zone: "graveyard" })).toHaveLength(1);
      });
});

/** @covers 5u5ic64930-a2 */
describe("Butler's Augury — influence measured before drawing", () => {
  for (const influence of [4, 5, 6, 8])
    for (const initialMemory of [0, 2])
      it(`influence ${influence}, ${initialMemory} existing memory cards`, () => {
        const champion = createLineageTestChampion(butlersAugury, "Other");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [butlersAugury, ...Array.from({ length: influence }, () => woodlandSquirrels)],
              memory: Array.from({ length: initialMemory }, () => woodlandSquirrels),
              "main-deck": [backdash, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { hand: Array.from({ length: 8 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          other = q.card(champion),
          top = p.zone("main-deck")[0]!;
        p.activate(butlersAugury, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        expect(p.zone("memory")).toHaveLength(initialMemory + 4);
        expect(p.zone("main-deck")).toHaveLength(3);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        const draw = Math.max(0, 5 - influence - initialMemory);
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(initialMemory + 4 + draw);
        expect(p.zone("hand")).toHaveLength(influence - 4);
        expect(p.zone("main-deck")).toHaveLength(3 - draw);
        expect(game.state.objects[top.objectId]!.zone).toBe(draw ? "memory" : "main-deck");
        expect(game.state.objects[hero.objectId]!.damage).toBe(draw);
        expect(game.state.objects[other.objectId]!.damage).toBe(0);
        expect(p.cards(butlersAugury, { zone: "graveyard" })).toHaveLength(1);
      });
  it("computes X at resolution after a free Kindle response reduces influence", () => {
    const champion = createLineageTestChampion(butlersAugury, "Other");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            butlersAugury,
            intensifiedPyre,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          graveyard: [sparkAlight, sparkAlight, sparkAlight],
          "main-deck": [backdash, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(champion),
      other = q.card(champion);
    p.activate(butlersAugury, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(p.zone("hand").length + p.zone("memory").length).toBe(5);
    p.activate(intensifiedPyre, {
      kindleCardIds: p.cards(sparkAlight, { zone: "graveyard" }).map((card) => card.objectId),
      targets: { "target-1": [other.objectId] },
    });
    expect(p.zone("hand").length + p.zone("memory").length).toBe(4);
    passEffectsStack(game);
    expect(p.zone("memory")).toHaveLength(5);
    expect(p.zone("main-deck")).toHaveLength(1);
    expect(p.zone("hand")).toHaveLength(0);
    expect(game.state.objects[hero.objectId]!.damage).toBe(1);
    expect(game.state.objects[other.objectId]!.damage).toBe(2);
  });
});
