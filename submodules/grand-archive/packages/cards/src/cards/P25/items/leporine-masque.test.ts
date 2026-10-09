import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { leporineMasque } from "./leporine-masque.ts";
import { flowingOubli } from "../../DTR/actions/flowing-oubli.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers pgysz2zfji-a1 */
describe("Leporine Masque — earned omen discount", () => {
  for (const count of [0, 1, 5, 6, 7])
    it(`counts ${count} own omens, excludes opposing omens, and floors the cost at zero`, () => {
      const champion = enableAllTestElements(
        grantTestChampionLevel(
          createClassBonusTestChampion(leporineMasque, false, "activation-discount"),
          1,
        ),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [leporineMasque],
            hand: [
              ...Array.from({ length: count }, () => flowingOubli),
              ...Array.from({ length: count * 2 + 6 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: count + 4 }, () => woodlandSquirrels),
            banishment: [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [
              flowingOubli,
              flowingOubli,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      for (const player of [q, p]) {
        if (player === p) advanceToMain(game, p.id);
        for (const action of player.cards(flowingOubli, { zone: "hand" })) {
          const selected = player.zone("main-deck")[0]!;
          player.activate(action, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        }
      }
      const cost = Math.max(0, 6 - count),
        source = p.card(leporineMasque),
        top = p.zone("main-deck")[0]!,
        memory = p.zone("memory").length;
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      if (cost) {
        expect(() =>
          p.activateAbility(source, "pgysz2zfji-a1", { reservePayment: payment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activateAbility(source, "pgysz2zfji-a1", { reservePayment: payment });
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.zone("memory")).toHaveLength(memory + cost);
      expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe("memory");
      expect(p.zone("memory")).toHaveLength(memory + cost + 1);
      expect(game.state.objects[source.objectId]!.counters.omen ?? 0).toBe(0);
    });
});
