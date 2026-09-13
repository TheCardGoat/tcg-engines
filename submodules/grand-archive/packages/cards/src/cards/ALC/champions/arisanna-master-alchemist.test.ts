import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { arisannaMasterAlchemist } from "./arisanna-master-alchemist.ts";

/** @covers ltv5klryvf-a1 */
describe("arisanna-master-alchemist — Lineage", () => {
  proveChampionLineage({
    card: arisannaMasterAlchemist,
    lineageName: "Arisanna",
    level: 2,
    memoryCost: 2,
  });
});

const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf] as const;

/** @covers ltv5klryvf-a2 */
describe("Arisanna, Master Alchemist — Gather twice", () => {
  it("summons two Herb tokens when its entry trigger resolves", () => {
    const starter = lineageTestChampion("Arisanna", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      definitions: herbs,
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Arisanna", 1)],
        zones: {
          "material-deck": [arisannaMasterAlchemist],
          memory: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    player.materialize(arisannaMasterAlchemist);
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    expect(
      player.zone("field").filter((card) => game.state.objects[card.objectId]!.isToken),
    ).toHaveLength(2);
  });
});

/** @covers ltv5klryvf-a3 */
describe("Arisanna, Master Alchemist — inherited end-phase sacrifice", () => {
  it("sacrifices two same-name Herbs and draws a card", () => {
    const starter = lineageTestChampion("Arisanna", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Arisanna", 1),
          arisannaMasterAlchemist,
          lineageTestChampion("Arisanna", 3),
        ],
        zones: {
          field: [blightroot, blightroot],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const herbIds = game
      .player("player-one")
      .cards(blightroot, { zone: "field" })
      .map((card) => card.objectId);
    for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", herbIds);
    passEffectsStack(game);
    expect(game.player("player-one").cards(blightroot, { zone: "field" })).toHaveLength(0);
    expect(game.player("player-one").zone("hand")).toHaveLength(1);
  });
});
