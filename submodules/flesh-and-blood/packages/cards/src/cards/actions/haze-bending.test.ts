import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hazeBendingBlue } from "./haze-bending.ts";

describe("Haze Bending (EVR141) AAA", () => {
  it("happy: Spectra destroy creates a Spectral Shield token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: zyggyStarlight, arena: [hazeBendingBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggyStarlight);

    Dash.play(brutalAssaultBlue, {
      targetInstanceId: Zyggy.findCardInZone("arena", hazeBendingBlue),
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, hazeBendingBlue).toBeIn("graveyard");
    expect(Zyggy.zone("arena")).toContain("token:spectral-shield");
  });

  it("boundary: playing this as an aura does not create a Spectral Shield until it is destroyed", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [hazeBendingBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(hazeBendingBlue);
    game.helpers.resolveUntilIdle();

    expect(Zyggy.zone("arena")).toContain(hazeBendingBlue.canonicalId);
    expect(Zyggy.zone("arena")).not.toContain("token:spectral-shield");
  });
});
