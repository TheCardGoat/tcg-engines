import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { consumptionRing } from "./consumption-ring.ts";
import { unwelcomeFortune } from "../actions/unwelcome-fortune.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

function reachRecollection(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 48 && game.state.turn.phase !== "recollection"; i++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.phase).toBe("recollection");
}

/** @covers g8q7imka92-a1 */
describe("Consumption Ring — opposing recollection restriction and temporary tax", () => {
  for (const opposing of [false, true])
    for (const recollection of [false, true])
      it(`requires opposing=${opposing} and recollection=${recollection}`, () => {
        const champion = createClassBonusTestChampion(
          consumptionRing,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposing ? "playerTwo" : "playerOne",
          phase: recollection ? "materialize" : "main",
          playerOne: { champion, zones: { field: [consumptionRing] } },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(consumptionRing);
        if (recollection) reachRecollection(game);
        if (opposing) q.pass();
        if (opposing && recollection) {
          p.activateAbility(source, "g8q7imka92-a1");
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
        } else {
          const before = game.state;
          expect(() => p.activateAbility(source, "g8q7imka92-a1")).toThrow();
          expect(game.state).toEqual(before);
        }
      });

  for (const copies of [1, 2])
    it(`stacks ${copies} resolved taxes on every opposing non-ally activation and expires`, () => {
      const champion = createClassBonusTestChampion(consumptionRing, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            field: Array.from({ length: copies }, () => consumptionRing),
            hand: [unwelcomeFortune, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [
              ...Array.from({ length: 4 }, () => unwelcomeFortune),
              ...Array.from({ length: 24 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (count: number) =>
        q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, count)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      reachRecollection(game);
      q.pass();
      for (const source of p.cards(consumptionRing)) p.activateAbility(source, "g8q7imka92-a1");
      expect(p.zone("banishment")).toHaveLength(copies);
      p.pass();
      q.activate(q.cards(unwelcomeFortune, { zone: "hand" })[0]!, {
        targets: { "target-player": [p.id] },
        reservePayment: payment(2),
      });
      expect(q.zone("memory")).toHaveLength(2);
      passEffectsStack(game);
      q.pass();
      p.activate(unwelcomeFortune, {
        targets: { "target-player": [q.id] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(2);
      advanceToMain(game, q.id);
      expect(q.zone("memory")).toHaveLength(0);
      q.activate(q.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      expect(q.zone("memory")).toHaveLength(0);
      expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
      const cost = 2 + copies * 4;
      for (let n = 0; n < 2; n++) {
        const card = q.cards(unwelcomeFortune, { zone: "hand" })[0]!,
          before = game.state;
        expect(() =>
          q.activate(card, {
            targets: { "target-player": [p.id] },
            reservePayment: payment(cost - 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        q.activate(card, { targets: { "target-player": [p.id] }, reservePayment: payment(cost) });
        passEffectsStack(game);
        expect(q.zone("memory")).toHaveLength(cost * (n + 1));
      }
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      q.activate(q.card(unwelcomeFortune, { zone: "hand" }), {
        targets: { "target-player": [p.id] },
        reservePayment: payment(2),
      });
      passEffectsStack(game);
      expect(q.zone("memory")).toHaveLength(2);
    });
});
