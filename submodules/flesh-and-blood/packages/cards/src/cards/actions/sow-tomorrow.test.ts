import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { summerwoodShelterRed } from "../instants/summerwood-shelter.ts";
import { snatchRed } from "./snatch.ts";
import { sowTomorrowRed } from "./sow-tomorrow.ts";

describe("Sow Tomorrow family AAA", () => {
  it("happy: puts a GY Earth action on the bottom and banishes itself", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sowTomorrowRed],
        graveyard: [weaveEarthRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sowTomorrowRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: weaveEarthRed.canonicalId,
    });

    expect(Briar.zone("deck")[0]).toBe(weaveEarthRed.canonicalId);
    expectFabCard(Briar, sowTomorrowRed).toBeBanished();
  });

  it("boundary: with no Earth/Elemental action in graveyard it is unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sowTomorrowRed],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabUnplayable(() => Briar.play(sowTomorrowRed));
    expectFabCard(Briar, sowTomorrowRed).toBeIn("hand");
  });

  it("boundary: an Earth Instant is not an Earth action card", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sowTomorrowRed],
        graveyard: [summerwoodShelterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabUnplayable(() => Briar.play(sowTomorrowRed));
    expectFabCard(Briar, summerwoodShelterRed).toBeIn("graveyard");
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sowTomorrowRed],
        graveyard: [weaveEarthRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sowTomorrowRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: weaveEarthRed.canonicalId,
    });

    expectFabPlayer(Briar).toHaveAP(1);
  });
});
