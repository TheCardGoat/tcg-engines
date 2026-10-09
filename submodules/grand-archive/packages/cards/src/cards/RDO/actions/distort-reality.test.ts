import { describe } from "vitest";
import { distortReality } from "./distort-reality.ts";
import { proveChampionEphemerate } from "../../../testing/champion-ephemerate.ts";
/** @covers PhaEcpabC2-a2 */
describe("Distort Reality Ephemerate", () =>
  proveChampionEphemerate(distortReality, "Alice", 15, "choice"));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { graveGateau } from "../../PTM/items/grave-gateau.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers PhaEcpabC2-a1 */
describe("Distort Reality whole deck and reserve cap", () => {
  for (const count of [0, 1, 15])
    it(`returns ${count} Specters within the thirty reserve limit`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Alice", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [distortReality, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
            graveyard: [graveGateau],
            "main-deck": [...Array.from({ length: 15 }, () => graveGateau), woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Other", 0),
          zones: { graveyard: [graveGateau], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const deck = [...p.zone("main-deck")];
      p.activate(distortReality, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(p.zone("main-deck")).toHaveLength(0);
      for (const ref of deck) expect(p.zone("graveyard")).toContainEqual(ref);
      expect(q.zone("main-deck")).toHaveLength(1);
      const specters = p.cards(graveGateau, { zone: "graveyard" }).map((c) => c.objectId);
      const before = game.state;
      for (const invalid of [
        specters,
        [specters[0], specters[0]],
        [q.card(graveGateau).objectId],
        [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      const selected = specters.slice(0, count);
      answerDecision(game, "resolve-effect-choice", selected);
      passEffectsStack(game);
      expect(p.cards(graveGateau, { zone: "field" })).toHaveLength(count);
      for (const id of selected) {
        expect(game.state.objects[id]!.zone).toBe("field");
        expect(game.state.objects[id]!.states.has("ephemeral")).toBe(true);
        expect(game.state.objects[id]!.states.has("rested")).toBe(true);
      }
      expect(q.cards(graveGateau, { zone: "graveyard" })).toHaveLength(1);
      expect(game.state.objects[p.card(distortReality).objectId]!.zone).toBe("graveyard");
    });
});
