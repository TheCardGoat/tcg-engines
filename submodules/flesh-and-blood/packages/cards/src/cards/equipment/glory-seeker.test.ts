import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { glorySeeker } from "./glory-seeker.ts";

describe("Glory Seeker (HVY196) AAA", () => {
  it("happy: Instant 3{r} destroy this draws a card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [glorySeeker], resourcePoints: 3, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(glorySeeker);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, glorySeeker).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: 2{r} cannot activate", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [glorySeeker], resourcePoints: 2, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(glorySeeker);
    expectFabCard(game.as(bravo), glorySeeker).toBeIn("head");
  });

  it("timing: unused helm stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [glorySeeker], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabCard(Bravo, glorySeeker).toBeIn("head");
    expect(() => Bravo.activate(glorySeeker)).toThrow();
  });
});
