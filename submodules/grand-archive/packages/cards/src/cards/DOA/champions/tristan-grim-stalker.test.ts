import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { tristanGrimStalker } from "./tristan-grim-stalker.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers K5luT8aRzc-a1 @covers K5luT8aRzc-a2 */
describe("Tristan prepares only while awake at his own end and pays three on an ally hit", () => {
  for (const preparation of [0, 2, 3])
    for (const pay of [false, true])
      for (const hit of ["ally", "champion", "other-ally"] as const)
        it(`preparation=${preparation}, pay=${pay}, hit=${hit}`, () => {
          const starter = lineageTestChampion("Tristan", 0),
            foeChampion = lineageTestChampion("Opponent", 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage: [lineageTestChampion("Tristan", 1), tristanGrimStalker],
              zones: {
                field: [trainingSword, woodlandSquirrels],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: foeChampion,
              zones: {
                field: [giantTortoise],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(starter),
            foe = q.card(foeChampion),
            ally = q.card(giantTortoise),
            own = p.card(woodlandSquirrels, { zone: "field" });
          for (let i = 0; i < preparation; i++) {
            advanceToMain(game, q.id);
            expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(i + 1);
            advanceToMain(game, p.id);
            expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(i + 1);
          }
          if (hit === "other-ally") p.declareAttack(own, ally);
          else
            p.declareAttack(hero, hit === "ally" ? ally : foe, {
              weaponIds: [p.card(trainingSword).objectId],
            });
          let offered = false;
          for (let i = 0; i < 96 && game.state.combat; i++) {
            const decision = game.state.decision,
              wait = game.waitState();
            if (decision?.kind === "resolve-optional-effect") {
              offered = true;
              answerDecision(game, "resolve-optional-effect", pay);
            } else if (decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind}`);
          }
          const paid = preparation >= 3 && pay && hit === "ally";
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
            preparation - (paid ? 3 : 0),
          );
          expect(game.state.objects[ally.objectId]!.zone).toBe(paid ? "graveyard" : "field");
          if (hit !== "ally") expect(offered).toBe(false);
          advanceToMain(game, q.id);
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
            preparation - (paid ? 3 : 0) + (hit === "other-ally" ? 1 : 0),
          );
        });
});
