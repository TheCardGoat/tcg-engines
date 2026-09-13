import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain, answerDecision } from "../../../testing/decisions.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";
import { describe } from "vitest";
import { luxerasMap } from "./luxeras-map.ts";

/** @covers s23UHXgcZq-a2 */
describe("Luxera's Map \u2014 resolution", () => {
  proveRestedEntry({ card: luxerasMap, cost: { kind: "memory", amount: 1 } });
});

/** @covers s23UHXgcZq-a1 @covers s23UHXgcZq-a3 */
describe("Luxera's Map payment and slow search", () => {
  for (const classBonus of [false, true])
    it(`materializes for ${classBonus ? 0 : 1} then searches at slow speed`, () => {
      const champion = createClassBonusTestChampion(luxerasMap, classBonus, "activation-discount");
      const deck = [...Array.from({ length: 8 }, () => woodlandSquirrels), grayWolf];
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: { "material-deck": [luxerasMap], memory: [woodlandSquirrels], "main-deck": deck },
        },
        playerTwo: { champion, zones: { "main-deck": deck } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.materialize(luxerasMap);
      expect(p.zone("memory")).toHaveLength(classBonus ? 1 : 0);
      passEffectsStack(game);
      const map = p.card(luxerasMap);
      expect(() => p.activateAbility(map, "s23UHXgcZq-a3")).toThrow();
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      q.pass();
      const before = game.state;
      expect(() => p.activateAbility(map, "s23UHXgcZq-a3")).toThrow();
      expect(game.state).toEqual(before);
      advanceToMain(game, p.id);
      const chosen = p.card(grayWolf, { zone: "main-deck" }),
        deckBefore = p.zone("main-deck").map((c) => c.objectId),
        memoryBefore = p.zone("memory").length;
      p.activateAbility(map, "s23UHXgcZq-a3");
      expect(game.state.objects[map.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[chosen.objectId]!.zone).toBe("main-deck");
      passEffectsStack(game);
      const pending = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-choice", [
          q.card(grayWolf, { zone: "main-deck" }).objectId,
        ]),
      ).toThrow();
      expect(game.state).toEqual(pending);
      answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
      passEffectsStack(game);
      expect(game.state.objects[chosen.objectId]!.zone).toBe("memory");
      expect(p.zone("memory")).toHaveLength(memoryBefore + 1);
      expect(
        p
          .zone("main-deck")
          .map((c) => c.objectId)
          .sort(),
      ).toEqual(deckBefore.filter((id) => id !== chosen.objectId).sort());
      expect(() => p.activateAbility(map, "s23UHXgcZq-a3")).toThrow();
    });
});
