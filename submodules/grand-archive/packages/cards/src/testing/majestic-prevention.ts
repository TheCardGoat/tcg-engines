import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { theMajesticSpirit } from "../cards/FTC/allies/the-majestic-spirit.ts";
import { ghostsOfPendragon } from "../cards/DOA/allies/ghosts-of-pendragon.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision } from "./decisions.ts";
function settle(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 128; i++) {
    const d = game.state.decision;
    if (d?.kind === "order-triggered-abilities")
      answerDecision(game, "order-triggered-abilities", d.pendingTriggerIds);
    else if (d?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", false);
    else if (d?.kind === "choose-replacement")
      answerDecision(game, "choose-replacement", d.candidateIds[0]);
    else if (d?.kind === "choose-retaliators") answerDecision(game, "choose-retaliators", []);
    else if (!game.state.combat && game.state.stack.length === 0) return;
    else {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind} ${d?.kind}`);
      game.player(wait.playerId).pass();
    }
  }
  throw new Error("Damage did not settle");
}
export function proveMajesticPrevention() {
  for (const matching of [false, true])
    for (const copies of [0, 1, 2])
      for (const kind of [
        "own-crux",
        "own-normal",
        "source",
        "enemy-crux",
        "champion-combat",
        "unpreventable",
      ] as const)
        for (const amount of kind === "unpreventable" ? [2] : [1, 2, 3, 4, 5]) {
          if (kind === "source" && copies === 0) continue;
          it(`class=${matching}, sources=${copies}, target=${kind}, damage=${amount}`, () => {
            const base = enableAllTestElements(
              createClassBonusTestChampion(theMajesticSpirit, matching, "activation-discount"),
            );
            const champion = {
              ...base,
              layout: {
                kind: "single-faced" as const,
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30 } },
              },
            };
            const qbase = enableAllTestElements(
              createClassBonusTestChampion(fireball, false, "activation-discount"),
            );
            const opponent = grantTestChampionLevel(
              {
                ...qbase,
                layout: {
                  kind: "single-faced" as const,
                  face: {
                    ...requireSingleFace(qbase),
                    stats: { level: 0, life: 30, power: amount },
                  },
                },
              },
              amount - 1,
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [
                    ...Array.from({ length: copies }, () => theMajesticSpirit),
                    ghostsOfPendragon,
                    giantTortoise,
                  ],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  field: [ghostsOfPendragon],
                  hand: [
                    fireball,
                    sparkAlight,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                  ],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const target =
              kind === "champion-combat"
                ? p.card(champion)
                : kind === "source"
                  ? p.cards(theMajesticSpirit, { zone: "field" })[0]!
                  : kind === "own-normal"
                    ? p.card(giantTortoise)
                    : kind === "enemy-crux"
                      ? q.card(ghostsOfPendragon)
                      : p.card(ghostsOfPendragon);
            let preventers =
              kind === "source"
                ? copies - 1
                : kind === "own-crux" || kind === "champion-combat"
                  ? copies
                  : 0;
            let expected = amount;
            while (preventers-- > 0) expected = Math.floor(expected / 2);
            const start = game.state.eventHistory.length;
            if (kind === "champion-combat") q.declareAttack(q.card(opponent), target);
            else
              q.activate(kind === "unpreventable" ? sparkAlight : fireball, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, kind === "unpreventable" ? 2 : 4)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                targets: { "target-1": [target.objectId] },
              });
            settle(game);
            const events = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId);
            expect(events.map((e) => (e.type === "damage-marked" ? e.amount : 0))).toEqual(
              expected ? [expected] : [],
            );
            const life =
              kind === "champion-combat"
                ? 30
                : kind === "source"
                  ? 10
                  : kind === "own-normal"
                    ? 6
                    : 4;
            expect(game.state.objects[target.objectId]!.zone).toBe(
              expected >= life ? "graveyard" : "field",
            );
            if (expected < life) expect(game.state.objects[target.objectId]!.damage).toBe(expected);
          });
        }
}

import { disorientingWinds } from "../cards/DOA/actions/disorienting-winds.ts";
export function proveMajesticDeparture() {
  for (const matching of [false, true])
    for (const amount of [1, 3])
      it(`repeated damage=${amount}, class=${matching}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(theMajesticSpirit, matching, "activation-discount"),
        );
        const opponent = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(fireball, false, "activation-discount"),
          ),
          amount - 1,
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [theMajesticSpirit, ghostsOfPendragon] } },
          playerTwo: {
            champion: opponent,
            zones: {
              hand: [
                fireball,
                fireball,
                fireball,
                disorientingWinds,
                ...Array.from({ length: 18 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(theMajesticSpirit),
          target = p.card(ghostsOfPendragon);
        const pay = (n: number) =>
          q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (let i = 1; i <= 2; i++) {
          q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(4),
            targets: { "target-1": [target.objectId] },
          });
          settle(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(i * Math.floor(amount / 2));
        }
        q.activate(disorientingWinds, {
          reservePayment: pay(6 - amount),
          targets: { "target-1": [source.objectId] },
        });
        settle(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
        const start = game.state.eventHistory.length;
        q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(4),
          targets: { "target-1": [target.objectId] },
        });
        settle(game);
        expect(
          game.state.eventHistory
            .slice(start)
            .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
            .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
        ).toEqual([amount]);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          amount === 3 ? "graveyard" : "field",
        );
      });
}
