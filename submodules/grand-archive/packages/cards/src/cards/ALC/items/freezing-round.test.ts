import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { reposition } from "../actions/reposition.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { freezingRound } from "./freezing-round.ts";

/** @covers r7ch2bbmoq-a1 */
describe("Freezing Round — load", () => {
  proveLoadBullet({ card: freezingRound, abilityId: "r7ch2bbmoq-a1", reserveCost: 0 });
});

function advanceToEnd(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to end phase`);
  }
  throw new Error("Did not reach the requested end phase");
}

/** @covers r7ch2bbmoq-a2 */
describe("Freezing Round — random memory banish and delayed return", () => {
  for (const hitsChampion of [false, true]) {
    for (const memoryCount of [0, 1, 2]) {
      it(`temporarily banishes from ${memoryCount} memory cards only on champion hit (${hitsChampion})`, () => {
        const champion = createClassBonusTestChampion(freezingRound, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          randomSeed: 17,
          playerOne: {
            champion,
            zones: {
              field: [freezingRound, seekersRifle],
              memory: [supplyDrone],
              "main-deck": [woodlandSquirrels, reposition],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [supplyDrone],
              memory: [woodlandSquirrels, reposition].slice(0, memoryCount),
              "main-deck": [woodlandSquirrels, reposition],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const originalMemory = opponent.zone("memory");
        const ownMemory = player.zone("memory");
        const gun = player.card(seekersRifle, { zone: "field" });
        player.activateAbility(freezingRound, "r7ch2bbmoq-a1", {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(
          player.card(champion, { zone: "field" }),
          opponent.card(hitsChampion ? champion : supplyDrone, { zone: "field" }),
          { weaponIds: [gun.objectId] },
        );
        advanceCombatToTrigger(game, "r7ch2bbmoq-a2");
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "r7ch2bbmoq-a2",
          ),
        ).toBe(hitsChampion);
        expect(opponent.zone("memory")).toEqual(originalMemory);
        const randomBefore = game.state.random;
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        const banished = opponent.zone("banishment");
        expect(banished).toHaveLength(hitsChampion && memoryCount > 0 ? 1 : 0);
        for (const ref of banished) expect(originalMemory).toContainEqual(ref);
        expect(opponent.zone("memory")).toEqual(
          originalMemory.filter((ref) => !banished.some((gone) => gone.objectId === ref.objectId)),
        );
        expect(player.zone("memory")).toEqual(ownMemory);
        if (hitsChampion && memoryCount === 2) expect(game.state.random).not.toEqual(randomBefore);
        advanceToEnd(game, "player-one");
        passEffectsStack(game);
        expect(opponent.zone("banishment")).toEqual(banished);
        advanceToEnd(game, "player-two");
        expect(opponent.zone("banishment")).toEqual(banished);
        passEffectsStack(game);
        expect(opponent.zone("banishment")).toHaveLength(0);
        expect(opponent.zone("memory")).toEqual(banished);
      });
    }
  }
});

/** @covers r7ch2bbmoq-a3 */
describe("Freezing Round — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: freezingRound });
});
