import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { flameblessedTrainee } from "./flameblessed-trainee.ts";

function reachMain(game: GrandArchiveTestEngine) {
  for (let step = 0; game.state.turn.phase !== "main" && step < 24; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe("main");
}

/** @covers qmyn2rz308-a1 */
describe("Flameblessed Trainee — optional Fire discard for this attack", () => {
  for (const classBonus of [false, true])
    for (const allyTarget of [false, true]) {
      for (const available of [false, true])
        for (const accept of [false, true]) {
          it(`Class Bonus=${classBonus}, ally=${allyTarget}, Fire=${available}, accept=${accept}`, () => {
            const champion = createClassBonusTestChampion(
              flameblessedTrainee,
              classBonus,
              "activation-discount",
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [flameblessedTrainee],
                  hand: [
                    woodlandSquirrels,
                    ...(available ? [airshipEngineer, airshipEngineer] : []),
                  ],
                  graveyard: [airshipEngineer],
                  memory: [airshipEngineer],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [giantTortoise],
                  hand: [airshipEngineer],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const player = game.player("player-one");
            const opponent = game.player("player-two");
            const trainee = player.card(flameblessedTrainee);
            const target = allyTarget ? opponent.card(giantTortoise) : opponent.card(champion);
            const hand = player.zone("hand");
            const grave = player.zone("graveyard");
            player.declareAttack(trainee, target);
            expect(
              game.state.stack.filter((item) => item.kind === "triggered-ability"),
            ).toHaveLength(classBonus ? 1 : 0);
            expect(player.zone("hand")).toEqual(hand);
            passEffectsStack(game);
            if (game.state.decision?.kind === "resolve-optional-effect")
              answerDecision(game, "resolve-optional-effect", accept);
            const succeeds = classBonus && allyTarget && available && accept;
            const selected = succeeds
              ? player.cards(airshipEngineer, { zone: "hand" })[1]!
              : undefined;
            if (selected) {
              for (const invalid of [
                [],
                player.cards(airshipEngineer, { zone: "hand" }).map((ref) => ref.objectId),
                [player.card(woodlandSquirrels, { zone: "hand" }).objectId],
                [player.card(airshipEngineer, { zone: "graveyard" }).objectId],
                [player.card(airshipEngineer, { zone: "memory" }).objectId],
                [opponent.card(airshipEngineer).objectId],
                [trainee.objectId],
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            }
            passEffectsStack(game);
            expect(player.zone("hand")).toEqual(
              hand.filter((ref) => ref.objectId !== selected?.objectId),
            );
            expect(player.zone("graveyard")).toEqual(selected ? [...grave, selected] : grave);
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[target.objectId]!.damage).toBe(succeeds ? 4 : 1);
            advanceToRecollection(game, opponent.id);
            advanceToRecollection(game, player.id);
            reachMain(game);
            const championTarget = opponent.card(champion);
            const damage = game.state.objects[championTarget.objectId]!.damage;
            player.declareAttack(trainee, championTarget);
            passEffectsStack(game);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[championTarget.objectId]!.damage).toBe(damage + 1);
          });
        }
    }
});
