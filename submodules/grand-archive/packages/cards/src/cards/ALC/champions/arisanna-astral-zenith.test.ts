import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { astraSight } from "../actions/astra-sight.ts";
import { cometfall } from "../actions/cometfall.ts";
import { arisannaAstralZenith } from "./arisanna-astral-zenith.ts";

/** @covers q3huqj5bba-a1 */
describe("arisanna-astral-zenith — Lineage", () => {
  proveChampionLineage({
    card: arisannaAstralZenith,
    lineageName: "Arisanna",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers q3huqj5bba-a2 */
describe("Arisanna, Astral Zenith — free Starcalling", () => {
  it("pays zero rather than a card's Starcalling cost", () => {
    const starter = lineageTestChampion("Arisanna", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Arisanna", 1),
          lineageTestChampion("Arisanna", 2),
          arisannaAstralZenith,
        ],
        zones: {
          hand: [astraSight],
          "main-deck": [cometfall, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    player.activate(astraSight);
    passEffectsStack(game);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    const called = player.card(cometfall, { zone: "main-deck" });
    answerDecision(game, "resolve-glimpse", {
      kind: "starcall",
      cardId: called.objectId,
      bottom: glimpse.cardIds.filter((id) => id !== called.objectId),
      costOptionIndex: 1,
    });
    expect(game.state.objects[called.objectId]!.activationStates.has("starcalled")).toBe(true);
  });
});
