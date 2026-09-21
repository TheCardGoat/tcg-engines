import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rileTheAbyss } from "./rile-the-abyss.ts";
import { fleetingGuard } from "./fleeting-guard.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ye7f7o5yut-a1 */
describe("Rile the Abyss — draw, optional Specter discards, then replacement draws", () => {
  for (const mode of ["zero", "one", "two", "drawn", "none"] as const)
    it(`resolves ${mode} with exact payment and ordered choices`, () => {
      const champion = createClassBonusTestChampion(rileTheAbyss, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              rileTheAbyss,
              ...(mode === "none" ? [] : [evercurrentRaider, fleetingGuard]),
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            field: [evercurrentRaider],
            memory: [evercurrentRaider],
            graveyard: [evercurrentRaider],
            "main-deck": Array.from({ length: 5 }, () =>
              mode === "none" ? woodlandSquirrels : evercurrentRaider,
            ),
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [evercurrentRaider], "main-deck": [evercurrentRaider] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck");
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const selected =
        mode === "one"
          ? [p.card(fleetingGuard)]
          : mode === "two"
            ? [p.card(fleetingGuard), p.card(evercurrentRaider, { zone: "hand" })]
            : mode === "drawn"
              ? [deck[0]!]
              : [];
      const before = game.state;
      expect(() => p.activate(rileTheAbyss, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(rileTheAbyss, { reservePayment: payment });
      expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("main-deck");
      passEffectsStack(game);
      expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("hand");
      if (mode !== "none") {
        expect(p.zone("main-deck")).toHaveLength(4);
        for (const invalid of [
          [p.card(evercurrentRaider, { zone: "field" }).objectId],
          [p.card(evercurrentRaider, { zone: "memory" }).objectId],
          [p.card(evercurrentRaider, { zone: "graveyard" }).objectId],
          [q.card(evercurrentRaider, { zone: "hand" }).objectId],
          [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
          [
            deck[0]!.objectId,
            p.card(fleetingGuard).objectId,
            p
              .cards(evercurrentRaider, { zone: "hand" })
              .find((c) => c.objectId !== deck[0]!.objectId)!.objectId,
          ],
        ]) {
          const checkpoint = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(checkpoint);
        }
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((c) => c.objectId),
        );
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      for (const card of selected)
        expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
      for (const card of deck.slice(1, 1 + selected.length))
        expect(game.state.objects[card.objectId]!.zone).toBe("hand");
      expect(p.zone("main-deck")).toEqual(deck.slice(1 + selected.length));
      expect(p.zone("memory")).toHaveLength(4);
      expect(p.zone("graveyard")).toHaveLength(2 + selected.length);
      expect(q.zone("hand")).toHaveLength(1);
      expect(q.zone("main-deck")).toHaveLength(1);
    });
});
