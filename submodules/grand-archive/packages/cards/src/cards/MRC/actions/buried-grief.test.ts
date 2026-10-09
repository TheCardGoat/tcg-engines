import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { buriedGrief } from "./buried-grief.ts";

/** @covers rfnrow8iop-a1 */
describe("Buried Grief — draw then top-deck", () => {
  for (const matching of [false, true])
    for (const deckSize of [2, 3, 5])
      for (const selectedIndex of [0, 1, 2])
        it(`class=${matching}, deck=${deckSize}, return=${selectedIndex}`, () => {
          const champion = createClassBonusTestChampion(
            buriedGrief,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  buriedGrief,
                  fireball,
                  ...Array.from({ length: 3 }, () => woodlandSquirrels),
                ],
                memory: [potionOfHealing],
                "main-deck": [
                  potionOfHealing,
                  favorableWinds,
                  woodlandSquirrels,
                  potionOfHealing,
                  fireball,
                ].slice(0, deckSize),
              },
            },
            playerTwo: { champion, zones: { hand: [fireball], "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(buriedGrief),
            held = p.card(fireball, { zone: "hand" });
          const deck = p.zone("main-deck"),
            enemyHand = q.zone("hand"),
            enemyDeck = q.zone("main-deck");
          p.activate(source, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          const memory = p.zone("memory");
          expect(p.zone("main-deck")).toEqual(deck);
          expect(p.zone("hand")).toEqual([held]);
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          const available = [held, ...deck.slice(0, 2)],
            selected = available[selectedIndex]!;
          expect(p.zone("hand")).toEqual(available);
          expect(p.zone("main-deck")).toEqual(deck.slice(2));
          for (const ids of [
            [],
            [selected.objectId, selected.objectId],
            [available[0]!.objectId, available[1]!.objectId],
            [p.card(potionOfHealing, { zone: "memory" }).objectId],
            [q.card(fireball).objectId],
            [source.objectId],
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(p.zone("main-deck")).toEqual([selected, ...deck.slice(2)]);
          expect(p.zone("hand")).toEqual(available.filter((c) => c !== selected));
          expect(p.zone("memory")).toEqual(memory);
          expect(q.zone("hand")).toEqual(enemyHand);
          expect(q.zone("main-deck")).toEqual(enemyDeck);
          expect(game.state.objects[source.objectId]?.zone).toBe("graveyard");
          expect(game.state.decision).toBeNull();
        });
  for (const deckSize of [0, 1])
    it(`loses when drawing two from ${deckSize} before returning a held card`, () => {
      const champion = createClassBonusTestChampion(buriedGrief, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [buriedGrief, fireball, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            "main-deck": [potionOfHealing].slice(0, deckSize),
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        held = p.card(fireball);
      p.activate(buriedGrief, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.winnerIds).toEqual([q.id]);
      expect(game.state.decision).toBeNull();
      expect(p.zone("main-deck")).toHaveLength(0);
      expect(game.state.objects[held.objectId]?.zone).toBe("hand");
    });
});
