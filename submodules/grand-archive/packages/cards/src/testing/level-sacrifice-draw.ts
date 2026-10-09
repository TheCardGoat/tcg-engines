import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grantTestChampionLevel } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveLevelSacrificeDraw(card: Card, abilityId: string, minimum: number) {
  const token = card.definitionKind === "token-representation";
  for (const level of [minimum - 1, minimum, minimum + 1])
    for (const opponentTurn of [false, true])
      it(`checks current own level and pays sacrifice before drawing: level=${level}, opponent=${opponentTurn}`, () => {
        const champion = grantTestChampionLevel(lineageTestChampion("Draw", 0), level);
        const opponent = grantTestChampionLevel(lineageTestChampion("Opponent", 0), minimum + 1);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opponentTurn ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: { field: [card], "main-deck": [woodlandSquirrels, cramSession] },
          },
          playerTwo: {
            champion: opponent,
            zones: { field: [card], "main-deck": [woodlandSquirrels, cramSession] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          other = q.card(card);
        if (opponentTurn) q.pass();
        if (level < minimum) {
          const before = game.state;
          expect(() => p.activateAbility(source, abilityId)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        const deck = p.zone("main-deck").map((c) => c.objectId);
        p.activateAbility(source, abilityId);
        expect(p.zone("hand")).toHaveLength(0);
        expect(p.cards(card, { zone: "field" })).toHaveLength(0);
        if (token) expect(game.state.objects[source.objectId]).toBeUndefined();
        else expect(p.cards(card, { zone: "graveyard" })).toEqual([source]);
        const afterCost = game.state;
        expect(() => p.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(afterCost);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(deck.slice(0, 1));
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
        expect(q.cards(card, { zone: "field" })).toEqual([other]);
        expect(q.zone("hand")).toHaveLength(0);
      });

  for (const expired of [false, true])
    it(`uses temporary level only after resolution and before expiry: expired=${expired}`, () => {
      const champion = grantTestChampionLevel(lineageTestChampion("Draw", 0), minimum - 1);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [cramSession, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, cramSession, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      p.activate(cramSession, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      const beforeResolution = game.state;
      expect(() => p.activateAbility(source, abilityId)).toThrow();
      expect(game.state).toEqual(beforeResolution);
      passEffectsStack(game);
      if (expired) {
        advanceToMain(game, q.id);
        q.pass();
        const before = game.state;
        expect(() => p.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        expect(p.cards(card, { zone: "field" })).toEqual([source]);
      } else {
        const deck = p.zone("main-deck").map((c) => c.objectId);
        p.activateAbility(source, abilityId);
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(deck.slice(0, 1));
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
      }
    });

  if (!token)
    for (const zone of ["hand", "memory", "graveyard", "banishment"] as const)
      it(`cannot sacrifice a source from ${zone}`, () => {
        const champion = grantTestChampionLevel(lineageTestChampion("Draw", 0), minimum);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { [zone]: [card], "main-deck": [woodlandSquirrels] } },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          before = game.state;
        expect(() => p.activateAbility(p.card(card, { zone }), abilityId)).toThrow();
        expect(game.state).toEqual(before);
      });
}
