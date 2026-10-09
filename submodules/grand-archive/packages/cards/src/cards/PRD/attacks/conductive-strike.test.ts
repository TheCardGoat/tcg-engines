import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { conductiveStrike } from "./conductive-strike.ts";
import { chargeStatic } from "../actions/charge-static.ts";
import { surgedCoordinator } from "../allies/surged-coordinator.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  answerDecision,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
function settle(game: GrandArchiveTestEngine, accept = false) {
  let offered = 0;
  for (let i = 0; i < 128; i++) {
    const decision = game.state.decision;
    if (decision?.kind === "order-triggered-abilities")
      answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
    else if (decision?.kind === "resolve-optional-effect") {
      offered++;
      answerDecision(game, "resolve-optional-effect", accept);
    } else if (decision?.kind === "resolve-effect-payment") {
      const p = game.player(decision.playerId),
        pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-payment", { reservePayment: pay.slice(0, 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-effect-payment", { reservePayment: pay });
    } else if (decision?.kind === "choose-retaliators")
      answerDecision(game, "choose-retaliators", []);
    else if (!game.state.combat && game.state.stack.length === 0) return offered;
    else {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind} ${decision?.kind}`);
      game.player(wait.playerId).pass();
    }
  }
  throw new Error("Combat did not finish");
}
/** @covers dDOMoeCJyK-a1 */
describe("Conductive Strike — counts charged own objects", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 2, 3])
      for (const counters of [1, 3])
        it(`class=${matching}, charged objects=${count}, counters each=${counters}`, () => {
          const champion = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(conductiveStrike, matching, "activation-discount"),
            ),
            counters,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [surgedCoordinator, surgedCoordinator, woodlandSquirrels],
                hand: [
                  conductiveStrike,
                  chargeStatic,
                  chargeStatic,
                  chargeStatic,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [chargeStatic, woodlandSquirrels, woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            enemy = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          q.activate(chargeStatic, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [enemy.objectId] },
          });
          passEffectsStack(game);
          advanceToMain(game, p.id);
          for (const target of [hero, ...p.cards(surgedCoordinator, { zone: "field" })].slice(
            0,
            count,
          )) {
            p.activate(p.cards(chargeStatic, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.counters.static).toBe(counters);
          }
          p.activate(conductiveStrike, { attackAttackerId: hero.objectId, reservePayment: pay(2) });
          passEffectsStack(game);
          declareResolvedAttack(
            game,
            hero.objectId,
            enemy.objectId,
            "Attack with Conductive Strike",
          );
          settle(game);
          expect(game.state.objects[enemy.objectId]!.damage).toBe(1 + count);
          expect(game.state.objects[enemy.objectId]!.counters.static).toBe(counters);
        });
});
/** @covers dDOMoeCJyK-a2 */
describe("Conductive Strike — paid hit counters", () => {
  for (const matching of [false, true])
    for (const accept of [false, true])
      it(`class=${matching}, accept=${accept}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(conductiveStrike, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [surgedCoordinator, surgedCoordinator, woodlandSquirrels],
              hand: [conductiveStrike, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: { champion, zones: { field: [surgedCoordinator] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          enemy = q.card(champion);
        p.activate(conductiveStrike, {
          attackAttackerId: hero.objectId,
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, enemy.objectId, "Attack with Conductive Strike");
        expect(settle(game, accept)).toBe(matching ? 1 : 0);
        expect(game.state.objects[enemy.objectId]!.damage).toBe(1);
        for (const object of [hero, ...p.cards(surgedCoordinator, { zone: "field" })])
          expect(game.state.objects[object.objectId]!.counters.static ?? 0).toBe(
            matching && accept ? 1 : 0,
          );
        for (const object of [
          p.card(woodlandSquirrels, { zone: "field" }),
          enemy,
          q.card(surgedCoordinator),
        ])
          expect(game.state.objects[object.objectId]!.counters.static ?? 0).toBe(0);
        expect(p.zone("memory")).toHaveLength(matching && accept ? 4 : 2);
      });
});
