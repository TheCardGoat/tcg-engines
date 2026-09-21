import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { mindbreakBullet } from "./mindbreak-bullet.ts";

/** @covers 9htu9agwj4-a1 */
describe("mindbreak-bullet — load", () => {
  proveLoadBullet({ card: mindbreakBullet, abilityId: "9htu9agwj4-a1", reserveCost: 0 });
});

/** @covers 9htu9agwj4-a2 */
describe("Mindbreak Bullet — Class Bonus champion hit", () => {
  for (const hitsChampion of [false, true]) {
    for (const classBonus of [false, true]) {
      for (const memoryCount of [0, 2]) {
        it(`discards from the hit champion's memory (champion=${hitsChampion}, class=${classBonus}, cards=${memoryCount})`, () => {
          const champion = createClassBonusTestChampion(
            mindbreakBullet,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: { field: [mindbreakBullet, seekersRifle], memory: [reposition] },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels],
                memory: [woodlandSquirrels, reposition].slice(0, memoryCount),
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const memory = opponent.zone("memory");
          const ownMemory = player.zone("memory");
          const gun = player.card(seekersRifle, { zone: "field" });
          player.activateAbility(mindbreakBullet, "9htu9agwj4-a1", {
            targets: { "target-weapon": [gun.objectId] },
          });
          passEffectsStack(game);
          player.declareAttack(
            player.card(champion, { zone: "field" }),
            opponent.card(hitsChampion ? champion : woodlandSquirrels, { zone: "field" }),
            { weaponIds: [gun.objectId] },
          );
          const beforeReload = game.state;
          expect(() =>
            player.activateAbility(mindbreakBullet, "9htu9agwj4-a1", {
              targets: { "target-weapon": [gun.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(beforeReload);
          expect(opponent.zone("memory")).toEqual(memory);
          for (let step = 0; step < 64; step++) {
            if (
              game.state.stack.some(
                (item) => item.kind === "triggered-ability" && item.ability.id === "9htu9agwj4-a2",
              )
            )
              break;
            if (!game.state.combat) break;
            const wait = game.waitState();
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else if (game.state.decision?.kind === "resolve-optional-effect") {
              expect(game.state.resolution?.sourceId).toBe(gun.objectId);
              answerDecision(game, "resolve-optional-effect", false);
            } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected combat state ${wait.kind}`);
          }
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "9htu9agwj4-a2",
            ),
          ).toBe(classBonus && hitsChampion);
          expect(opponent.zone("memory")).toEqual(memory);
          passEffectsStack(game);
          if (classBonus && hitsChampion && memoryCount > 0) {
            const looked = game.state.eventHistory.filter(
              (event) => event.type === "cards-looked-at",
            );
            expect(looked).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  playerId: "player-one",
                  objectIds: memory.map((ref) => ref.objectId),
                }),
              ]),
            );
            expect(game.state.decision?.playerId).toBe("player-one");
            answerDecision(game, "resolve-effect-choice", [memory[1]!.objectId]);
            passEffectsStack(game);
            expect(opponent.zone("memory")).toEqual(memory.slice(0, 1));
            expect(opponent.zone("graveyard")).toEqual([memory[1]]);
          } else {
            expect(opponent.zone("memory")).toEqual(memory);
            for (const ref of memory) expect(opponent.zone("graveyard")).not.toContainEqual(ref);
          }
          expect(player.zone("memory")).toEqual(ownMemory);
          expect(game.state.stack).toHaveLength(0);
        });
      }
    }
  }
});
