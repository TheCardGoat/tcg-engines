import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { briar } from "../shared/test-recipients.ts";
import { harnessLightningRed } from "./harness-lightning.ts";
import { harnessLightningYellow } from "./harness-lightning.ts";

describe("Harness Lightning (AUR013) AAA", () => {
  it("happy: Lightning Flow deals 3 arcane after a Lightning card was played this turn", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [blinkBlue, harnessLightningRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle();
    Briar.play(harnessLightningRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Briar, harnessLightningRed).toBeIn("graveyard");
  });

  it("boundary: without a Lightning card played this turn, deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [harnessLightningRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(harnessLightningRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Briar, harnessLightningRed).toBeIn("graveyard");
  });

  it("boundary: playing a Lightning instant after Harness resolves does not retroactively deal the 3", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [harnessLightningRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(harnessLightningRed);
    game.helpers.resolveUntilIdle();
    Briar.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});

describe("Harness Lightning (AUR020) AAA", () => {
  it("happy: Lightning Flow deals 2 arcane after a Lightning card was played this turn", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [blinkBlue, harnessLightningYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle();
    Briar.play(harnessLightningYellow, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabCard(Briar, harnessLightningYellow).toBeIn("graveyard");
  });

  it("boundary: without a Lightning card played this turn, deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [harnessLightningYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(harnessLightningYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Briar, harnessLightningYellow).toBeIn("graveyard");
  });

  it("boundary: playing a Lightning instant after Harness resolves does not retroactively deal the 2", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [harnessLightningYellow, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(harnessLightningYellow);
    game.helpers.resolveUntilIdle();
    Briar.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
