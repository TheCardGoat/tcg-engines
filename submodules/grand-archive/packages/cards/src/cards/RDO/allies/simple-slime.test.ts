import { describe } from "vitest";
import { simpleSlime } from "./simple-slime.ts";
import { proveCannotAttack } from "../../../testing/cannot-attack.ts";
/** @covers Zxab4Vi0wx-a1 */
describe("Simple Slime — cannot attack, can retaliate with power", () =>
  proveCannotAttack(simpleSlime, true));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers Zxab4Vi0wx-a2 */
describe("Simple Slime — prevent three from each damage event", () => {
  for (const matching of [false, true])
    for (const kind of ["spell", "combat", "unpreventable"] as const)
      for (const amount of kind === "unpreventable" ? [2] : [1, 2, 3, 4, 5])
        it(`class=${matching}, kind=${kind}, raw damage=${amount}`, () => {
          const champion = createClassBonusTestChampion(
              simpleSlime,
              matching,
              "activation-discount",
            ),
            base = enableAllTestElements(
              createClassBonusTestChampion(fireball, false, "activation-discount"),
            );
          const opponent = grantTestChampionLevel(
            {
              ...base,
              layout: {
                kind: "single-faced",
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: amount } },
              },
            },
            amount - 1,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: { champion, zones: { field: [simpleSlime] } },
            playerTwo: {
              champion: opponent,
              zones: {
                hand: [
                  fireball,
                  fireball,
                  sparkAlight,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(simpleSlime),
            expected = kind === "unpreventable" ? amount : Math.max(0, amount - 3);
          for (let i = 0; i < (kind === "spell" && expected < 2 ? 2 : 1); i++) {
            const start = game.state.eventHistory.length;
            if (kind === "combat") {
              q.declareAttack(q.card(opponent), source);
              game.resolveCombatWithoutRetaliation();
            } else {
              q.activate(q.cards(kind === "spell" ? fireball : sparkAlight, { zone: "hand" })[0]!, {
                targets: { "target-1": [source.objectId] },
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, kind === "spell" ? 4 : 2)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
            }
            const dealt = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === source.objectId)
              .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0);
            expect(dealt).toBe(expected);
            const dies = expected * (i + 1) >= 2;
            expect(game.state.objects[source.objectId]!.zone).toBe(dies ? "graveyard" : "field");
            if (!dies) expect(game.state.objects[source.objectId]!.damage).toBe(expected * (i + 1));
          }
        });
});
