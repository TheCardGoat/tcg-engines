import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { threadbareTunic } from "./threadbare-tunic.ts";

describe("Threadbare Tunic (AZL005) AAA", () => {
  it("happy: Instant destroy with an empty hand gains 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.must.activate(threadbareTunic);

    expectFabCard(Bravo, threadbareTunic).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("boundary: cannot activate while a card is in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(threadbareTunic);
    expectFabCard(game.as(bravo), threadbareTunic).toBeIn("chest");
  });

  it("timing: Instant activation spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.must.activate(threadbareTunic);

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, threadbareTunic).toBeIn("graveyard");
  });
});
