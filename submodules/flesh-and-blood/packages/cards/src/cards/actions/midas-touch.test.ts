import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { chumFriendlyFirstMateYellow } from "./chum-friendly-first-mate.ts";
import { midasTouchYellow } from "./midas-touch.ts";

describe("Midas Touch (SEA188) AAA", () => {
  it("happy: destroys target ally and its controller creates Gold equal to its cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [midasTouchYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [chumFriendlyFirstMateYellow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(midasTouchYellow, {
      target: Dash.cardIn("arena", chumFriendlyFirstMateYellow).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, chumFriendlyFirstMateYellow).toBeIn("graveyard");
    expect(Dash.zone("arena").filter((id) => id === "token:gold")).toHaveLength(4);
  });

  it("boundary: cannot be played when no ally is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [midasTouchYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(midasTouchYellow)).toThrow();
    expectFabCard(Bravo, midasTouchYellow).toBeIn("hand");
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [midasTouchYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [chumFriendlyFirstMateYellow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(midasTouchYellow, {
      target: Dash.cardIn("arena", chumFriendlyFirstMateYellow).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
