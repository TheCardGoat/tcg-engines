import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
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

import { baubleOfMending } from "./bauble-of-mending.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
/** @covers hLHpI5rHIK-a1 */
describe("Bauble of Mending banishes, draws, and temporarily strengthens an optional own non-Human ally", () => {
  for (const classBonus of [false, true])
    for (const selected of [false, true])
      it(`class=${classBonus}, selected=${selected}`, () => {
        const champion = createClassBonusTestChampion(
            baubleOfMending,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [baubleOfMending, giantTortoise, eagerPage],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(baubleOfMending),
          target = p.card(giantTortoise),
          top = p.zone("main-deck")[0]!,
          life = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
        const before = game.state;
        for (const bad of [q.card(giantTortoise), p.card(eagerPage), p.card(champion), source]) {
          expect(() =>
            p.activateAbility(source, "hLHpI5rHIK-a1", { targets: { "target-1": [bad.objectId] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "hLHpI5rHIK-a1", {
          targets: { "target-1": selected ? [target.objectId] : [] },
        });
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual([top]);
        expect(q.zone("hand")).toHaveLength(0);
        expect(life()).toBe(classBonus && selected ? 7 : 6);
        expect(() =>
          p.activateAbility(source, "hLHpI5rHIK-a1", { targets: { "target-1": [] } }),
        ).toThrow();
        advanceToMain(game, q.id);
        expect(life()).toBe(6);
      });
});
