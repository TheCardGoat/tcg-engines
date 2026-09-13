import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { nimbyRed } from "./nimby.ts";

describe("Nimby (SEA220) AAA", () => {
  it("happy: on attack may search the deck for a Nimblism and put it into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [nimbyRed],
        deck: [nimblismBlue, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(nimbyRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    expect(Briar.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Briar.zone("deck")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundary: declining the search leaves Nimblism in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [nimbyRed],
        deck: [nimblismBlue, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(nimbyRed);
    expect(Briar.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Briar).toHaveHandCount(0);
  });

  it("timing: without a Nimblism in deck the optional search finds nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [nimbyRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(nimbyRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Briar).toHaveHandCount(0);
    expect(Briar.zone("hand")).not.toContain(nimbyRed.canonicalId);
  });
});
