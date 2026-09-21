import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { inertSword } from "./inert-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 2s08hssegf-a1 @covers 2s08hssegf-a2 */
describe("Inert Sword — reserve materialization surcharge and Guardian power", () => {
  for (const matching of [false, true])
    it(`requires two reserve despite zero memory cost, matching class=${matching}`, () => {
      const champion = createClassBonusTestChampion(inertSword, matching, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [inertSword],
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        sword = p.card(inertSword);
      const payment = p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const reservePayment of [[], payment.slice(0, 1)]) {
        const before = game.state;
        expect(() => p.materialize(inertSword, { reservePayment })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.materialize(inertSword, { reservePayment: payment });
      expect(p.zone("hand")).toHaveLength(0);
      expect(p.zone("memory")).toHaveLength(2);
      expect(p.zone("banishment")).toHaveLength(0);
      expect(game.state.objects[sword.objectId]!.zone).toBe("effects-stack");
      passEffectsStack(game);
      expect(game.state.objects[sword.objectId]!.zone).toBe("field");
      advanceToMain(game, p.id);
      p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [sword.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(matching ? 3 : 2);
      expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1);
    });
});
