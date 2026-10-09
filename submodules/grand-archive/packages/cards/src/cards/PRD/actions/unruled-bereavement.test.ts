import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { unruledBereavement } from "./unruled-bereavement.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers cAcgxzrz6z-a2
 * @covers cAcgxzrz6z-a3
 */
describe("Unruled Bereavement damage and death empowerment", () => {
  for (const matching of [false, true])
    for (const level of [6, 7, 8])
      for (const expired of [false, true]) {
        it(`affects both sides at level ${level}, class ${matching}, expiry ${expired}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(unruledBereavement, matching, "activation-discount"),
              level,
            ),
          );
          const opponent = lineageTestChampion("Opponent", 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  unruledBereavement,
                  fireball,
                  fireball,
                  ...Array.from({ length: 16 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise, woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: [giantTortoise, woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(opponent);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const small = [
            p.card(woodlandSquirrels, { zone: "field" }),
            q.card(woodlandSquirrels, { zone: "field" }),
          ];
          p.activate(unruledBereavement, { reservePayment: pay(4) });
          for (let step = 0; step < 10; step++) {
            passEffectsStack(game);
            const decision = game.state.decision;
            if (decision?.kind !== "order-triggered-abilities") break;
            answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
          }
          expect(game.state.stack).toHaveLength(0);
          for (const player of [p, q])
            expect(game.state.objects[player.card(giantTortoise).objectId]!.damage).toBe(
              level >= 7 ? 3 : 0,
            );
          for (const squirrel of small)
            expect(game.state.objects[squirrel.objectId]!.zone).toBe(
              level >= 7 ? "graveyard" : "field",
            );
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          expect(game.state.objects[foe.objectId]!.damage).toBe(0);
          if (expired) advanceToMain(game, p.id, game.state.turn.number);
          const target = expired ? q.card(giantTortoise) : foe;
          const history = game.state.eventHistory.length;
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          const hits = game.state.eventHistory
            .slice(history)
            .filter((e) => e.type === "damage-marked");
          expect(hits).toHaveLength(1);
          expect(hits[0]!.amount).toBe(1 + level + (level >= 7 && !expired ? 4 : 0));
          if (expired) expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(1 + level);
        });
      }
});
