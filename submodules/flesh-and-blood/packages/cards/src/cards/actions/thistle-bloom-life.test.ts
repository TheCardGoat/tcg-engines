import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { thistleBloomLifeYellow } from "./thistle-bloom-life.ts";

/**
 * Thistle Bloom // Life (ROS005) — Runeblade Action // Earth Instant.
 * Printed: Meld. Create X Runechant tokens, where X is the total {h} you've
 * gained this turn. Life: Gain 1{h}.
 */

describe("Thistle Bloom // Life (ROS005) AAA", () => {
  it("happy: melded Life then Thistle mints 1 Runechant from the 1{h} gained", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [thistleBloomLifeYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(thistleBloomLifeYellow, { playMethod: { kind: "meld" } });
    game.passBoth();
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expectFabCard(Briar, thistleBloomLifeYellow).toBeIn("graveyard");
  });

  it("boundary: Thistle Bloom alone with 0{h} gained this turn creates 0 Runechants", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [thistleBloomLifeYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(thistleBloomLifeYellow, { playMethod: { kind: "face", face: "left" } });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });

  it("timing: Life as an instant spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [thistleBloomLifeYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(thistleBloomLifeYellow, { playMethod: { kind: "face", face: "right" } });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveAP(1);
  });
});
