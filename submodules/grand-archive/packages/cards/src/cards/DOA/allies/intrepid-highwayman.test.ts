import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "./giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { intrepidHighwayman } from "./intrepid-highwayman.ts";

/** @covers WUAOMTZ7P2-a3 */
describe("Intrepid Highwayman — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: intrepidHighwayman });
});

/** @covers WUAOMTZ7P2-a2 */
describe("Intrepid Highwayman's retaliation-only power", () => {
  for (const retaliating of [true, false])
    it(`deals ${retaliating ? 4 : 1} while ${retaliating ? "retaliating" : "attacking"}`, () => {
      const champion = createClassBonusTestChampion(
        intrepidHighwayman,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [retaliating ? giantTortoise : intrepidHighwayman] },
        },
        playerTwo: {
          champion,
          zones: { field: [retaliating ? intrepidHighwayman : giantTortoise] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        attacker = p.card(retaliating ? giantTortoise : intrepidHighwayman),
        defender = q.card(retaliating ? intrepidHighwayman : giantTortoise);
      p.declareAttack(attacker, defender);
      for (let step = 0; game.state.combat && step < 64; step++) {
        if (game.state.decision?.kind === "choose-retaliators")
          answerDecision(game, "choose-retaliators", retaliating ? [defender.objectId] : []);
        else {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
      }
      expect(game.state.combat).toBeNull();
      expect(game.state.objects[defender.objectId]!.damage).toBe(1);
      expect(game.state.objects[attacker.objectId]!.damage).toBe(retaliating ? 4 : 0);
    });
});
