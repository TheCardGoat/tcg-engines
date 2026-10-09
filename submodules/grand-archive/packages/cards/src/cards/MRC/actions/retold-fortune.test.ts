import { describe, expect, it } from "vitest";
import { retoldFortune } from "./retold-fortune.ts";
import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers ow8iopvc8s-a2 */
describe("Retold Fortune — class and level gate Floating Memory", () => {
  proveLevelFloatingMemory(retoldFortune, 2, false);
  proveLevelFloatingMemory(retoldFortune, 2, true);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
/** @covers ow8iopvc8s-a1 */
describe("Retold Fortune — optionally discard exactly one own hand Spell before drawing", () => {
  for (const matching of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        it(`class=${matching}, Spell available=${available}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            retoldFortune,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              preserveMainDeckOrder: true,
              zones: {
                hand: [
                  retoldFortune,
                  ...(available ? [fireball, sparkAlight] : []),
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: [fireball],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { hand: [fireball] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            deck = p.zone("main-deck"),
            chosen = available ? p.card(fireball, { zone: "hand" }) : undefined;
          p.activate(retoldFortune, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(p.zone("main-deck")).toEqual(deck);
          if (available) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            const before = game.state;
            for (const ids of [
              [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
              [q.card(fireball).objectId],
              [p.card(fireball, { zone: "graveyard" }).objectId],
              [chosen!.objectId, p.card(sparkAlight).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", accept ? [chosen!.objectId] : []);
            passEffectsStack(game);
          } else if (game.state.decision) {
            answerDecision(game, "resolve-effect-choice", []);
            passEffectsStack(game);
          }
          const draws = available && accept;
          expect(p.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
          expect(p.zone("memory")).toHaveLength(2);
          expect(p.cards(retoldFortune, { zone: "graveyard" })).toHaveLength(1);
          if (chosen)
            expect(game.state.objects[chosen.objectId]!.zone).toBe(draws ? "graveyard" : "hand");
          if (draws) expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("hand");
          expect(q.cards(fireball, { zone: "hand" })).toHaveLength(1);
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeNull();
        });
});
