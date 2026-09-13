import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { astraSight } from "./astra-sight.ts";

/** @covers zuj68m69iq-a2 */
describe("Astra Sight — Glimpse then draw", () => {
  it("resolves the Glimpse choice before drawing the selected top card", () => {
    const champion = createClassBonusTestChampion(astraSight, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [astraSight], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const top = player.zone("main-deck")[0]!;
    player.activate(astraSight);
    passEffectsStack(game);
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: [top.objectId],
      bottom: [],
    });
    passEffectsStack(game);

    expect(player.zone("hand")).toEqual([top]);
    expect(player.zone("main-deck")).toHaveLength(1);
  });
});

/** @covers zuj68m69iq-a1 */
describe("Astra Sight — Starcalling", () => {
  it("may activate a looked-at copy for zero reserve and bottoms no other cards", () => {
    const champion = createClassBonusTestChampion(astraSight, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [astraSight], "main-deck": [astraSight, astraSight, astraSight] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(astraSight);
    passEffectsStack(game);
    const decision = game.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse decision");
    const starcalledId = decision.cardIds[0]!;
    answerDecision(game, "resolve-glimpse", {
      kind: "starcall",
      cardId: starcalledId,
      bottom: [],
    });

    expect(game.state.objects[starcalledId]!.zone).toBe("effects-stack");
    expect(
      game.state.stack.some(
        (item) => item.kind === "card-activation" && item.cardId === starcalledId,
      ),
    ).toBe(true);
  });
});
