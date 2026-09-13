import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";

describe("Cerebellum Processor (AIO026) AAA", () => {
  it("happy: enters with 2 steam, crank removes 1, then Once per Turn Action draws", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(cerebellumProcessorBlue);
    game.untilIdle();

    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Teklo, cerebellumProcessorBlue).toHaveCounters(1, "steam");
    expectFabPlayer(Teklo).toHaveAP(1);

    Teklo.activate(cerebellumProcessorBlue);
    game.untilIdle();

    expectFabPlayer(Teklo).toHaveHandCount(1);
  });

  it("boundary: declining crank keeps 2 steam and spends the play AP", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(cerebellumProcessorBlue, { crank: false });
    game.untilIdle();

    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Teklo, cerebellumProcessorBlue).toHaveCounters(2, "steam");
    expectFabPlayer(Teklo).toHaveAP(0);
  });

  it("timing: start of your turn you may remove steam; start of the opponent's turn does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: cerebellumProcessorBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: [nimblismBlue], deckTop: [nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");

    game.as(bravo).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Teklo, cerebellumProcessorBlue).toHaveCounters(0, "steam");
  });
});
