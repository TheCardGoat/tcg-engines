import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tuffnutBumblingHulkster } from "./tuffnut-bumbling-hulkster.ts";

describe("Tuffnut, Bumbling Hulkster (SUP001) AAA", () => {
  it("happy: pitching a 6+{p} deck-top card cheers the crowd and creates Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnutBumblingHulkster,
        deck: [nimblismBlue, regurgitatingSlogRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    Tuffnut.activate(tuffnutBumblingHulkster);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Tuffnut, tuffnutBumblingHulkster).toBeTapped();
    expect(Tuffnut.zone("pitch")).toContain(regurgitatingSlogRed.canonicalId);
    expectFabToken(game, "toughness").toHaveCount(1).toBeIn("arena");
  });

  it("boundary: pitching a card with fewer than 6{p} does not create Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnutBumblingHulkster,
        deck: [regurgitatingSlogRed, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    Tuffnut.activate(tuffnutBumblingHulkster);
    game.passBoth();

    expect(Tuffnut.zone("pitch")).toContain(nimblismBlue.canonicalId);
    expectFabToken(game, "toughness").toHaveCount(0);
  });
});
