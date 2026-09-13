import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { sealedBladeDoa as sealedBlade } from "../weapons/sealed-blade-doa.ts";
import { spiritBladeGhostStrike } from "./spirit-blade-ghost-strike.ts";
/** @covers vcZSHNHvKX-a1 */
describe("Ghost Strike pays from its material deck to strengthen champion attacks this turn", () => {
  for (const accept of [false, true])
    for (const available of [false, true])
      it(`accept=${accept}, available=${available}`, () => {
        const champion = createClassBonusTestChampion(
          spiritBladeGhostStrike,
          true,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [spiritBladeGhostStrike, spiritBladeGhostStrike],
              field: [woodlandSquirrels],
              "material-deck": available ? [trainingSword, curvedDagger] : [],
              banishment: [sealedBlade],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              "material-deck": [trainingSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          attacks = p.cards(spiritBladeGhostStrike, { zone: "hand" });
        p.activate(attacks[0]!, { attackAttackerId: hero.objectId });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "First Ghost Strike");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        if (accept && available) {
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(trainingSword).objectId]),
          ).toThrow();
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [p.card(sealedBlade).objectId]),
          ).toThrow();
          answerDecision(game, "resolve-effect-choice", [p.card(trainingSword).objectId]);
          passEffectsStack(game);
          expect(p.card(trainingSword, { zone: "banishment" })).toBeDefined();
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(accept && available ? 2 : 1);
        p.declareAttack(woodlandSquirrels, foe);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(accept && available ? 3 : 2);
        advanceToMain(game, p.id, game.state.turn.number);
        p.activate(attacks[1]!, { attackAttackerId: hero.objectId });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "Later Ghost Strike");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(accept && available ? 4 : 3);
      });
});
