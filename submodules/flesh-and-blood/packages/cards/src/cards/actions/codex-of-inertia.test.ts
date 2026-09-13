import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { codexOfInertiaYellow } from "./codex-of-inertia.ts";

describe("Codex of Inertia (OUT161) AAA", () => {
  it("happy: each hero arsenals their deck-top face-down and discards", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfInertiaYellow, nimblismBlue],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfInertiaYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, snatchRed).toBeIn("arsenal");
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabCard(Arakni, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabToken(game, "inertia").toHaveCount(1);
    expect(Arakni.zone("arena")).toContain("token:ponder");
    expect(Dash.zone("arena")).toContain("token:inertia");
  });

  it("boundary: a hero with an empty deck does not arsenal or discard", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfInertiaYellow, nimblismBlue],
        actionPoints: 1,
        deck: [],
      },
      { hero: dash, hand: [snatchRed], deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfInertiaYellow);
    game.helpers.resolveUntilIdle();

    expect(Arakni.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expectFabCard(Arakni, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: create Ponder under you and Inertia under the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfInertiaYellow],
        actionPoints: 1,
        deck: [],
      },
      { hero: dash, hand: [], deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfInertiaYellow);
    game.helpers.resolveUntilIdle();

    expect(Arakni.zone("arena")).toContain("token:ponder");
    expect(Dash.zone("arena")).toContain("token:inertia");
  });
});
