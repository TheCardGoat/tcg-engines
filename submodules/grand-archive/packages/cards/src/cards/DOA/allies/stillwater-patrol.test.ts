import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { stillwaterPatrol } from "./stillwater-patrol.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { conceal } from "../actions/conceal.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers LNSRQ5xW6E-a2 */
describe("Stillwater Patrol's attack-specific power", () => {
  for (const stealth of [false, true])
    it(`attacking stealth=${stealth} adds exactly ${stealth ? 1 : 0} power`, () => {
      const champion = createClassBonusTestChampion(conceal, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [stillwaterPatrol] } },
        playerTwo: {
          champion,
          zones: { field: [giantTortoise], hand: [conceal, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = q.card(giantTortoise);
      if (stealth) {
        p.pass();
        q.activate(conceal, {
          reservePayment: q
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      }
      p.declareAttack(stillwaterPatrol, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(stealth ? 3 : 2);
    });
});
