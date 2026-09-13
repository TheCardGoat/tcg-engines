import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { reclaim } from "../actions/reclaim.ts";
import { zephyrAssistant } from "./zephyr-assistant.ts";
/** @covers XZFXOE9sEV-a1 @covers XZFXOE9sEV-a2 */
describe("Zephyr Assistant entry and leave triggers", () => {
  for (const matching of [true, false])
    it(`entry requires Class Bonus, leaving by return or death does not (${matching})`, () => {
      const champion = createClassBonusTestChampion(
        zephyrAssistant,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [zephyrAssistant, reclaim, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        id = p.card(champion).objectId;
      const count = () => game.state.objects[id]!.counters.enlighten ?? 0;
      const payment = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(zephyrAssistant, { reservePayment: payment() });
      expect(count()).toBe(0);
      passEffectsStack(game);
      expect(count()).toBe(matching ? 1 : 0);
      const source = p.card(zephyrAssistant, { zone: "field" });
      p.activate(reclaim, {
        reservePayment: payment(),
        targets: { "target-1": [source.objectId] },
      });
      expect(count()).toBe(matching ? 1 : 0);
      passEffectsStack(game);
      expect(count()).toBe(matching ? 2 : 1);
      expect(p.cards(zephyrAssistant, { zone: "hand" })).toHaveLength(1);
      p.activate(zephyrAssistant, { reservePayment: payment() });
      passEffectsStack(game);
      expect(count()).toBe(matching ? 3 : 1);
      advanceToMain(game, q.id);
      q.declareAttack(woodlandSquirrels, source);
      game.resolveCombatWithoutRetaliation();
      expect(p.cards(zephyrAssistant, { zone: "graveyard" })).toHaveLength(1);
      expect(count()).toBe(matching ? 4 : 2);
      expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten ?? 0).toBe(0);
    });
});
