import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { arondightAzureBlade } from "./arondight-azure-blade.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 29xxoo7dl5-a1
 * @covers 29xxoo7dl5-a2 */
describe("Arondight — refinement from Floating Memory", () => {
  for (const bonus of [false, true])
    for (const count of [0, 1, 3]) {
      it(`adds two attack power per banished card, Class Bonus=${bonus}, selected=${count}`, () => {
        const champion = createClassBonusTestChampion(
          arondightAzureBlade,
          bonus,
          "floating-memory",
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [arondightAzureBlade],
              memory: [woodlandSquirrels],
              graveyard: [reclaim, reclaim, reclaim, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { graveyard: [reclaim] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const selected = p.cards(reclaim, { zone: "graveyard" }).slice(0, count);
        p.materialize(arondightAzureBlade);
        passEffectsStack(game);
        if (bonus) {
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
          const before = game.state;
          for (const invalid of [
            p.card(woodlandSquirrels, { zone: "graveyard" }),
            q.card(reclaim),
          ]) {
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            selected.map((ref) => ref.objectId),
          );
          passEffectsStack(game);
        }
        const weapon = p.card(arondightAzureBlade, { zone: "field" });
        expect(game.state.objects[weapon.objectId]!.counters["named:refinement"] ?? 0).toBe(
          bonus ? count : 0,
        );
        expect(p.cards(reclaim, { zone: "banishment" })).toHaveLength(bonus ? count : 0);
        advanceToMain(game, p.id);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          1 + (bonus ? 2 * count : 0),
        );
      });
    }
});
