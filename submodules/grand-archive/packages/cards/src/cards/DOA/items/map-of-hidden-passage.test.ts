import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  passEffectsStack,
  advanceToMain,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { aesanProtector } from "../allies/aesan-protector.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";

import { mapOfHiddenPassage } from "./map-of-hidden-passage.ts";

/** @covers 2bzajcZZRD-a1 */
describe("Map of Hidden Passage \u2014 resolution", () => {
  proveRestedEntry({ card: mapOfHiddenPassage, cost: { kind: "memory", amount: 0 } });
});
import { corhaziInfiltrator } from "../allies/corhazi-infiltrator.ts";
/** @covers 2bzajcZZRD-a2 */
describe("Map of Hidden Passage protects either player's stealth units for this turn", () => {
  for (const opposing of [false, true])
    for (const stealth of [false, true])
      for (const expired of [false, true])
        it(`opposing=${opposing}, stealth=${stealth}, expired=${expired}`, () => {
          const champion = createClassBonusTestChampion(
            mapOfHiddenPassage,
            true,
            "activation-discount",
          );
          const attacker = stealth ? corhaziInfiltrator : woodlandSquirrels;
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                "material-deck": [mapOfHiddenPassage],
                field: opposing ? [aesanProtector] : [attacker],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: opposing ? [attacker] : [aesanProtector],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            map = p.card(mapOfHiddenPassage);
          p.materialize(map);
          passEffectsStack(game);
          advanceToMain(game, p.id);
          const rested = game.state;
          expect(() => p.activateAbility(map, "2bzajcZZRD-a2")).toThrow();
          expect(game.state).toEqual(rested);
          advanceToMain(game, p.id, game.state.turn.number);
          if (opposing) {
            advanceToMain(game, q.id);
            q.pass();
          }
          p.activateAbility(map, "2bzajcZZRD-a2");
          expect(game.state.objects[map.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          const attacking = opposing ? q : p,
            defending = opposing ? p : q;
          if (expired) advanceToMain(game, attacking.id, game.state.turn.number);
          const unit = attacking.card(attacker, { zone: "field" }),
            foe = defending.card(champion),
            guard = defending.card(aesanProtector);
          attacking.declareAttack(unit, foe);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
          const protectedAttack = stealth && !expired;
          expect(game.state.combat?.targetIds).toEqual([
            protectedAttack ? foe.objectId : guard.objectId,
          ]);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(protectedAttack ? 3 : 0);
          expect(game.state.objects[guard.objectId]!.damage).toBe(
            protectedAttack ? 0 : stealth ? 3 : 1,
          );
        });
});
