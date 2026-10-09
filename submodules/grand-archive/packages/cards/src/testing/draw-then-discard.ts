import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveDrawThenDiscard(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  draw: number,
  discard: number,
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = face.cost.amount;
  for (const spare of [0, discard + 1])
    for (const fromNew of spare === 0
      ? [discard]
      : Array.from({ length: discard + 1 }, (_, i) => i))
      for (const deckExtra of [0, 3])
        it(`draw ${draw}, discard ${discard}: spare=${spare}, new=${fromNew}, deck extra=${deckExtra}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  ...Array.from({ length: cost }, () => woodlandSquirrels),
                  ...Array.from({ length: spare }, () => sparkAlight),
                ],
                "main-deck": Array.from({ length: draw + deckExtra }, (_, i) =>
                  i % 2 === 0 ? woodlandSquirrels : sparkAlight,
                ),
                graveyard: [sparkAlight],
                banishment: [sparkAlight],
                field: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { hand: [sparkAlight], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          const deck = p.zone("main-deck"),
            old = p.cards(sparkAlight, { zone: "hand" }),
            opponentHand = q.zone("hand"),
            opponentDeck = q.zone("main-deck");
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: reservePayment.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment });
          expect(p.zone("main-deck")).toEqual(deck);
          expect(p.zone("hand")).toEqual(old);
          passEffectsStack(game);
          const drawn = deck.slice(0, draw),
            available = [...old, ...drawn];
          const selected = [...drawn.slice(0, fromNew), ...old.slice(0, discard - fromNew)];
          expect(p.zone("main-deck")).toEqual(deck.slice(draw));
          if (available.length > discard) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-effect-choice",
              playerId: p.id,
            });
            expect(p.zone("hand")).toEqual(available);
            expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
            const pending = game.state;
            const bad = [
              selected.slice(0, discard - 1).map((c) => c.objectId),
              available.slice(0, discard + 1).map((c) => c.objectId),
              ...[
                q.card(sparkAlight).objectId,
                p.zone("memory")[0]!.objectId,
                p.card(sparkAlight, { zone: "graveyard" }).objectId,
                p.card(sparkAlight, { zone: "banishment" }).objectId,
                source.objectId,
                p.card(woodlandSquirrels, { zone: "field" }).objectId,
              ].map((id) => [...available.slice(0, discard - 1).map((c) => c.objectId), id]),
              Array.from({ length: Math.max(2, discard) }, () => available[0]!.objectId),
            ];
            for (const ids of bad) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(pending);
            }
            answerDecision(
              game,
              "resolve-effect-choice",
              selected.map((c) => c.objectId),
            );
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(p.zone("hand")).toEqual(available.filter((c) => !selected.includes(c)));
          for (const c of selected) expect(game.state.objects[c.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(cost);
          expect(q.zone("hand")).toEqual(opponentHand);
          expect(q.zone("main-deck")).toEqual(opponentDeck);
        });

  for (let remaining = 0; remaining < draw; remaining++)
    it(`loses when drawing ${draw} cards from a deck with ${remaining}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels), sparkAlight],
            "main-deck": Array.from({ length: remaining }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        retained = p.card(sparkAlight);
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.winnerIds).toEqual([q.id]);
      expect(p.zone("main-deck")).toHaveLength(0);
      expect(game.state.objects[retained.objectId]!.zone).toBe("hand");
      expect(game.state.decision).toBeNull();
    });
}
