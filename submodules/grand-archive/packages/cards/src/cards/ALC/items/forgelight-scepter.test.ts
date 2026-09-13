import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { assassinsMantle } from "../../P24/items/assassins-mantle.ts";
import { forgelightScepter } from "./forgelight-scepter.ts";

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

/** @covers smw3rrii17-a1 */
describe("Forgelight Scepter — Class Bonus materialization discount", () => {
  for (const classBonus of [false, true]) {
    it(`costs ${classBonus ? 0 : 1} memory with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        forgelightScepter,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            memory: classBonus ? [] : [woodlandSquirrels],
            "material-deck": [forgelightScepter],
          },
        },
        playerTwo: { champion },
      });
      if (!classBonus) {
        const underpaid = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: { champion, zones: { "material-deck": [forgelightScepter] } },
          playerTwo: { champion },
        });
        const before = underpaid.state;
        expect(() => underpaid.player("player-one").materialize(forgelightScepter)).toThrow();
        expect(underpaid.state).toEqual(before);
      }
      const player = game.player("player-one");
      player.materialize(forgelightScepter);
      passEffectsStack(game);
      expect(player.cards(forgelightScepter, { zone: "field" })).toHaveLength(1);
      expect(player.zone("memory")).toHaveLength(0);
    });
  }
});

/** @covers smw3rrii17-a2 */
describe("Forgelight Scepter — opponent end-phase memory parity", () => {
  for (const memoryCount of [0, 1, 2]) {
    it(`deals ${memoryCount % 2 === 1 ? 2 : 0} at opponent memory count ${memoryCount}`, () => {
      const champion = createClassBonusTestChampion(forgelightScepter, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        phase: "main",
        playerOne: {
          champion,
          zones: {
            field: [forgelightScepter],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [assassinsMantle],
            memory: Array.from({ length: memoryCount }, () => woodlandSquirrels),
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const controller = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(champion);

      advanceToEnd(game, opponent.id);
      expect(game.state.stack).toMatchObject([
        { kind: "triggered-ability", ability: { id: "smw3rrii17-a2" } },
      ]);
      passEffectsStack(game);

      if (memoryCount % 2 === 1) {
        expect(game.state.decision?.kind).toBe("choose-replacement");
        answerDecision(game, "choose-replacement", true);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[target.objectId]!.damage).toBe(memoryCount % 2 === 1 ? 2 : 0);
      expect(
        opponent.cards(assassinsMantle, {
          zone: memoryCount % 2 === 1 ? "banishment" : "field",
        }),
      ).toHaveLength(1);
      expect(game.state.objects[controller.card(champion).objectId]!.damage).toBe(0);
    });
  }

  it("does not trigger at the beginning of its controller's end phase", () => {
    const champion = createClassBonusTestChampion(forgelightScepter, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "main",
      playerOne: { champion, zones: { field: [forgelightScepter] } },
      playerTwo: { champion },
    });
    const controller = game.player("player-one");
    advanceToEnd(game, controller.id);
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[controller.card(champion).objectId]!.damage).toBe(0);
  });
});
