import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lilyMarineCastellan } from "./lily-marine-castellan.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers l83tuzrl2a-a2 */
describe("Lily even-life attack trigger", () => {
  for (const even of [false, true])
    for (const accept of [false, true])
      it(`triggers only against even life ${even}, return choice ${accept}`, () => {
        const champion = lineageTestChampion("Own", 0),
          opponent = even
            ? lineageTestChampion("Foe", 0)
            : createClassBonusTestChampion(lilyMarineCastellan, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [lilyMarineCastellan], memory: [woodlandSquirrels] },
          },
          playerTwo: { champion: opponent },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          memory = p.card(woodlandSquirrels, { zone: "memory" }),
          target = q.card(opponent);
        p.declareAttack(p.card(lilyMarineCastellan), target);
        passEffectsStack(game);
        if (even) {
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) answerDecision(game, "resolve-effect-choice", [memory.objectId]);
          passEffectsStack(game);
        }
        expect(game.state.objects[memory.objectId]!.zone).toBe(even && accept ? "hand" : "memory");
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(even ? 2 : 1);
      });
});

import { proveCommandedWill } from "../../../testing/commanded-will.ts";
/** @covers l83tuzrl2a-a1 */
describe("lilyMarineCastellan — Commanded Will", () => {
  proveCommandedWill(lilyMarineCastellan, 2);
});
