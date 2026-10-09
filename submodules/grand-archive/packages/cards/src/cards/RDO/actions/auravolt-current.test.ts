import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { auravoltCurrent } from "./auravolt-current.ts";
import { proveChargedBanishmentActivation } from "../../../testing/charged-banishment-action.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers foy5mdrVCR-a1 @covers foy5mdrVCR-a2 */
describe("Auravolt Current — charged banishment activation", () =>
  proveChargedBanishmentActivation(auravoltCurrent, 2, false));
/** @covers foy5mdrVCR-a3 */
describe("Auravolt Current — memory exchange for selected players", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 2, 3])
      for (const selection of ["none", "self", "opponent", "both"] as const)
        it(`class=${matching}, opposing memory=${count}, targets=${selection}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(auravoltCurrent, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [auravoltCurrent, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                memory: Array.from({ length: count }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(auravoltCurrent);
          const ids =
            selection === "none"
              ? []
              : selection === "self"
                ? [p.id]
                : selection === "opponent"
                  ? [q.id]
                  : [p.id, q.id];
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const invalid of [[p.card(champion).objectId], [p.id, p.id]]) {
            expect(() =>
              p.activate(source, {
                reservePayment: payment,
                targets: { "target-players": invalid },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, { reservePayment: payment, targets: { "target-players": ids } });
          const decks = [p.zone("main-deck"), q.zone("main-deck")],
            memories = [p.zone("memory"), q.zone("memory")];
          passEffectsStack(game);
          for (let step = 0; game.state.decision && step < 4; step++) {
            const decision = game.state.decision;
            if (decision.kind !== "resolve-effect-choice")
              throw new Error(`Unexpected ${decision.kind}`);
            const chooser = game.player(decision.playerId),
              own = chooser.zone("memory"),
              prior = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [chooser.card(champion).objectId]),
            ).toThrow();
            expect(game.state).toEqual(prior);
            answerDecision(
              game,
              "resolve-effect-choice",
              own.slice(0, 2).map((c) => c.objectId),
            );
            passEffectsStack(game);
          }
          for (const [i, player] of [p, q].entries()) {
            const taken = ids.includes(player.id) ? Math.min(2, memories[i]!.length) : 0;
            expect(player.zone("main-deck")).toEqual(decks[i]!.slice(taken));
            expect(player.zone("memory")).toHaveLength(memories[i]!.length);
            expect(player.cards(woodlandSquirrels, { zone: "banishment" })).toHaveLength(taken);
            for (const ref of decks[i]!.slice(0, taken))
              expect(player.zone("memory")).toContainEqual(ref);
          }
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(0);
          expect(game.state.decision).toBeNull();
        });
});

describe("Auravolt Current — opposing charge trigger", () => {
  it("charges the opponent's card banished by the exchange", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(auravoltCurrent, true, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [auravoltCurrent, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: { memory: [auravoltCurrent], "main-deck": [woodlandSquirrels] },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = q.card(auravoltCurrent);
    p.activate(auravoltCurrent, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-players": [q.id] },
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[source.objectId]!.counters["named:charge"]).toBe(1);
  });
});
