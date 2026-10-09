import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveStartingGlimpse({
  card,
  count,
  draw,
  memory = false,
  drawFirst = false,
  summon,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  count: number;
  draw: number;
  memory?: boolean;
  drawFirst?: boolean;
  summon?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  for (const extra of drawFirst ? [-3, 0, 3] : [0, 3])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`starting entry: extra deck=${extra}, placement=${placement}, draw first=${drawFirst}`, () => {
        const opponent = lineageTestChampion("Blank opponent", 0);
        const size = (drawFirst ? draw + count : Math.max(draw, count)) + extra;
        const game = GrandArchiveTestEngine.start(
          [card, opponent, woodlandSquirrels, ...(summon ? [summon] : [])],
          {
            mode: "standard",
            randomSeed: 43,
            firstPlayerId: "player-one",
            players: [
              {
                id: "player-one",
                name: "One",
                startingChampionDefinitionId: card.canonicalId,
                materialDeck: [{ definitionId: card.canonicalId, count: 1 }],
                mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: size }],
              },
              {
                id: "player-two",
                name: "Two",
                startingChampionDefinitionId: opponent.canonicalId,
                materialDeck: [{ definitionId: opponent.canonicalId, count: 1 }],
                mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: 1 }],
              },
            ],
          },
          { validateDeckConstruction: false },
        );
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck");
        p.execute({ move: "complete-pregame-actions" });
        q.execute({ move: "complete-pregame-actions" });
        const drawn = drawFirst ? deck.slice(0, draw) : [];
        const remaining = drawFirst ? deck.slice(draw) : deck;
        const decision = game.state.decision;
        if (decision?.kind !== "resolve-glimpse")
          throw new Error(`Expected starting glimpse, got ${decision?.kind}`);
        expect(decision.playerId).toBe(p.id);
        expect(decision.cardIds).toEqual(remaining.slice(0, count).map((c) => c.objectId));
        expect(p.zone(memory ? "memory" : "hand")).toEqual(drawn);
        if (summon) {
          expect(p.cards(summon, { zone: "field" })).toHaveLength(0);
          expect(q.cards(summon, { zone: "field" })).toHaveLength(0);
        }
        const looked = remaining.slice(0, count).reverse();
        const bottom =
          placement === "bottom" ? looked : placement === "split" ? looked.slice(0, 2) : [];
        const top = looked.filter((c) => !bottom.includes(c));
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: [q.zone("main-deck")[0]!.objectId],
            bottom: [],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() =>
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: [...decision.cardIds, decision.cardIds[0]],
            bottom: [],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const resolved = p.execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "reorder",
            top: top.map((c) => c.objectId),
            bottom: bottom.map((c) => c.objectId),
          },
        });
        if (summon) {
          const summonedAt = resolved.events.findIndex((event) => event.type === "tokens-summoned");
          const draws = resolved.events.flatMap((event, index) =>
            event.type === "object-moved" && event.from === "main-deck" && event.to === "hand"
              ? [index]
              : [],
          );
          expect(draws).toHaveLength(draw);
          expect(summonedAt).toBeGreaterThan(draws.at(-1)!);
          const summoned = p.card(summon, { zone: "field" });
          expect(p.cards(summon, { zone: "field" })).toHaveLength(1);
          expect(q.cards(summon, { zone: "field" })).toHaveLength(0);
          expect(game.state.objects[summoned.objectId]).toMatchObject({
            isToken: true,
            ownerId: p.id,
            controllerId: p.id,
          });
          expect(game.state.objects[summoned.objectId]!.states.has("rested")).toBe(false);
        }
        passEffectsStack(game);
        const reordered = [...top, ...remaining.slice(count), ...bottom];
        expect(p.zone(memory ? "memory" : "hand")).toEqual(
          drawFirst ? drawn : reordered.slice(0, draw),
        );
        expect(p.zone("main-deck")).toEqual(drawFirst ? reordered : reordered.slice(draw));
        expect(p.zone(memory ? "hand" : "memory")).toHaveLength(0);
        expect(q.zone("hand")).toHaveLength(0);
        expect(q.zone("memory")).toHaveLength(0);
      });
}
