import { describe, expect, it } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { blazingDirewolf } from "./blazing-direwolf.ts";

/** @covers gKVMTAeLXQ-a1 */
describe("Blazing Direwolf \u2014 gKVMTAeLXQ-a1", () => {
  provePrideAlly({ card: blazingDirewolf, pride: 5, power: 4 });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  advanceCombatToTrigger,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";

import { giantTortoise } from "./giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers gKVMTAeLXQ-a2 */
describe("Blazing Direwolf's own attack deals targeted damage before combat", () => {
  for (const classBonus of [false, true])
    for (const own of [false, true])
      for (const championTarget of [false, true])
        it(`class=${classBonus}, own=${own}, champion=${championTarget}`, () => {
          const champion = grantTestChampionLevel(
              createClassBonusTestChampion(blazingDirewolf, classBonus, "activation-discount"),
              5,
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: { field: [blazingDirewolf, giantTortoise, trainingSword] },
              },
              playerTwo: { champion, zones: { field: [giantTortoise] } },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q,
            target = owner.card(championTarget ? champion : giantTortoise),
            foe = q.card(champion),
            wolf = p.card(blazingDirewolf);
          p.declareAttack(p.card(giantTortoise), foe);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(!own && championTarget ? 1 : 0);
          p.declareAttack(wolf, foe);
          advanceCombatToTrigger(game, "gKVMTAeLXQ-a2");
          if (classBonus) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [p.card(trainingSword).objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(
              own || !championTarget ? 2 : 3,
            );
          }
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(
            (classBonus ? 2 : 0) + (!own && championTarget ? 5 : 0),
          );
          expect(game.state.objects[wolf.objectId]!.states.has("rested")).toBe(true);
        });
});
