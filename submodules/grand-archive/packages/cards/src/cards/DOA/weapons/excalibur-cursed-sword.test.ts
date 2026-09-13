import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { excaliburCursedSword } from "./excalibur-cursed-sword.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
/** @covers 4sm14RaEkg-a1 @covers 4sm14RaEkg-a2 */
describe("Cursed Excalibur transfers on entry only with class bonus and damages its current materializer", () => {
  for (const classBonus of [false, true])
    for (const giveAway of [false, true])
      it(`class=${classBonus}, give away=${giveAway}`, () => {
        const champion = createClassBonusTestChampion(
            excaliburCursedSword,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                "material-deck": [excaliburCursedSword, trainingSword],
                hand: [woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                "material-deck": [trainingSword],
                hand: [woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(excaliburCursedSword),
          owner = classBonus && giveAway ? q : p;
        p.materialize(source);
        passEffectsStack(game);
        if (classBonus) {
          expect(() => answerDecision(game, "resolve-effect-choice", [source.objectId])).toThrow();
          answerDecision(game, "resolve-effect-choice", [owner.id]);
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.controllerId).toBe(owner.id);
        expect(game.state.objects[source.objectId]!.ownerId).toBe(p.id);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        advanceToMain(game, p.id);
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        for (let step = 0; step < 64; step++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice" && wait.playerId === q.id) break;
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        q.materialize(trainingSword);
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          owner.id === q.id ? 2 : 0,
        );
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        advanceToMain(game, q.id);
        for (let step = 0; step < 64; step++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        p.materialize(trainingSword);
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(
          owner.id === p.id ? 2 : 0,
        );
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          owner.id === q.id ? 2 : 0,
        );
        expect(game.state.objects[source.objectId]!.controllerId).toBe(owner.id);
      });
});
