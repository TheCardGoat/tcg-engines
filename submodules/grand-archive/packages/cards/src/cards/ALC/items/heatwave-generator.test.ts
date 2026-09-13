import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heatwaveGenerator } from "./heatwave-generator.ts";

function advanceToOwnMain(game: GrandArchiveTestEngine, afterTurn: number): void {
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > afterTurn &&
      game.state.turn.playerId === game.player("player-one").id &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach the controller's main phase");
}

/** @covers fzcyfrzrpl-a1 */
describe("Heatwave Generator — Class Bonus materialization discount", () => {
  for (const classBonus of [false, true]) {
    it(`costs ${classBonus ? 0 : 1} memory with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        heatwaveGenerator,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            memory: classBonus ? [] : [woodlandSquirrels],
            "material-deck": [heatwaveGenerator],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      if (!classBonus) {
        const underpaid = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: { champion, zones: { "material-deck": [heatwaveGenerator] } },
          playerTwo: { champion },
        });
        const before = underpaid.state;
        expect(() => underpaid.player("player-one").materialize(heatwaveGenerator)).toThrow();
        expect(underpaid.state).toEqual(before);
      }
      player.materialize(heatwaveGenerator);
      passEffectsStack(game);
      expect(player.cards(heatwaveGenerator, { zone: "field" })).toHaveLength(1);
      expect(player.zone("memory")).toHaveLength(0);
    });
  }
});

/** @covers fzcyfrzrpl-a2 */
describe("Heatwave Generator — controlled recollection target", () => {
  it("buffs one controlled ally for its controller's current turn only", () => {
    const champion = createClassBonusTestChampion(heatwaveGenerator, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [heatwaveGenerator, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const [target, otherAlly] = player.cards(woodlandSquirrels, { zone: "field" });
    const opposingAlly = opponent.card(woodlandSquirrels, { zone: "field" });

    advanceToRecollection(game, opponent.id);
    expect(game.state.stack).toHaveLength(0);
    advanceToRecollection(game, player.id);
    expect(game.state.decision?.kind).toBe("announce-triggered-ability");
    for (const invalid of [player.card(heatwaveGenerator), opposingAlly]) {
      const before = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [target!.objectId] },
    });
    passEffectsStack(game);

    const firstTurn = game.state.turn.number;
    advanceToOwnMain(game, firstTurn - 1);
    const enemyChampion = opponent.card(champion);
    player.declareAttack(otherAlly!, enemyChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[enemyChampion.objectId]!.damage).toBe(1);
    player.declareAttack(target!, enemyChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[enemyChampion.objectId]!.damage).toBe(3);

    advanceToRecollection(game, player.id);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [otherAlly!.objectId] },
    });
    passEffectsStack(game);
    advanceToOwnMain(game, game.state.turn.number - 1);
    player.declareAttack(target!, enemyChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[enemyChampion.objectId]!.damage).toBe(4);
  });
});
