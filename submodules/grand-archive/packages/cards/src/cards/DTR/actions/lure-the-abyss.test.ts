import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lureTheAbyss } from "./lure-the-abyss.ts";
import { fleetingGuard } from "./fleeting-guard.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers gqh3mw478q-a1 */
describe("Lure the Abyss — mandatory Specter graveyard placement and ordered remainder", () => {
  for (const mode of [
    "empty",
    "short-specters",
    "short-others",
    "mixed",
    "all-specters",
    "no-specters",
  ] as const)
    it(`reveals the top available four from ${mode}`, () => {
      const cards =
        mode === "empty"
          ? []
          : mode === "short-specters"
            ? [evercurrentRaider, fleetingGuard]
            : mode === "short-others"
              ? [woodlandSquirrels, giantTortoise]
              : mode === "mixed"
                ? [evercurrentRaider, fleetingGuard, woodlandSquirrels, giantTortoise]
                : Array.from({ length: 6 }, () =>
                    mode === "all-specters" ? evercurrentRaider : woodlandSquirrels,
                  );
      const champion = createClassBonusTestChampion(lureTheAbyss, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [lureTheAbyss, woodlandSquirrels, woodlandSquirrels], "main-deck": cards },
        },
        playerTwo: {
          champion,
          zones: { hand: [evercurrentRaider], "main-deck": [evercurrentRaider] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        revealed = deck.slice(0, 4);
      const specters = revealed.filter((c) =>
        [evercurrentRaider.canonicalId, fleetingGuard.canonicalId].includes(c.definitionId),
      );
      const remaining = revealed.filter((c) => !specters.includes(c));
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(lureTheAbyss, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(lureTheAbyss, { reservePayment: payment });
      expect(p.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      for (const card of specters)
        expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
      const order = [...remaining].reverse();
      if (remaining.length > 1) {
        for (const invalid of [
          order.slice(1).map((c) => c.objectId),
          order.map(() => order[0]!.objectId),
          [
            q.card(evercurrentRaider, { zone: "hand" }).objectId,
            ...order.slice(1).map((c) => c.objectId),
          ],
        ]) {
          const checkpoint = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(checkpoint);
        }
        answerDecision(
          game,
          "resolve-effect-choice",
          order.map((c) => c.objectId),
        );
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(p.zone("main-deck")).toEqual([...deck.slice(4), ...order]);
      expect(
        p
          .zone("graveyard")
          .map((c) => c.objectId)
          .sort(),
      ).toEqual(
        [
          ...specters.map((c) => c.objectId),
          p.card(lureTheAbyss, { zone: "graveyard" }).objectId,
        ].sort(),
      );
      expect(
        game.state.eventHistory
          .filter((e) => e.type === "card-revealed")
          .map((e) => e.objectId)
          .sort(),
      ).toEqual(revealed.map((c) => c.objectId).sort());
      expect(p.zone("hand")).toHaveLength(0);
      expect(q.zone("main-deck")).toHaveLength(1);
      expect(q.zone("hand")).toHaveLength(1);
    });
});
