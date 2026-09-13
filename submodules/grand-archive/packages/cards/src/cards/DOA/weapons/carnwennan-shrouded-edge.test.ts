import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { carnwennanShroudedEdge } from "./carnwennan-shrouded-edge.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
/** @covers Au8eN2Jtuu-a1 */
describe("Carnwennan prevents retaliation only when used by its matching class", () => {
  for (const classBonus of [false, true])
    for (const useWeapon of [false, true])
      it(`class=${classBonus}, using weapon=${useWeapon}`, () => {
        const champion = createClassBonusTestChampion(
          carnwennanShroudedEdge,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [carnwennanShroudedEdge, woodlandSquirrels] } },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          attacker = p.card(useWeapon ? champion : woodlandSquirrels),
          defender = q.card(giantTortoise);
        p.declareAttack(attacker, defender, {
          weaponIds: useWeapon ? [p.card(carnwennanShroudedEdge).objectId] : [],
        });
        let retaliationOffered = false;
        for (let step = 0; game.state.combat && step < 64; step++) {
          if (game.state.decision?.kind === "choose-retaliators") {
            retaliationOffered = true;
            answerDecision(game, "choose-retaliators", [defender.objectId]);
          } else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(retaliationOffered).toBe(!(classBonus && useWeapon));
        expect(game.state.objects[defender.objectId]!.damage).toBe(useWeapon ? 3 : 1);
        expect(game.state.objects[attacker.objectId]!.zone).toBe(useWeapon ? "field" : "graveyard");
        if (useWeapon)
          expect(game.state.objects[attacker.objectId]!.damage).toBe(classBonus ? 0 : 1);
      });
});
