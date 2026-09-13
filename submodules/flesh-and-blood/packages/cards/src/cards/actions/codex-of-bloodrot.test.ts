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
import { codexOfBloodrotYellow } from "./codex-of-bloodrot.ts";

describe("Codex of Bloodrot (OUT159) AAA", () => {
  it("happy: each hero puts a card from hand face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfBloodrotYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfBloodrotYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, nimblismBlue).toBeIn("arsenal");
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabToken(game, "bloodrot-pox").toHaveCount(1);
  });

  it("boundary: a hero with an empty hand does not arsenal a card", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfBloodrotYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfBloodrotYellow);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Arakni.zone("arsenal")).toHaveLength(0);
  });

  it("timing: create Ponder under you and Bloodrot Pox under the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfBloodrotYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfBloodrotYellow);
    game.helpers.resolveUntilIdle();

    expect(Arakni.zone("arena")).toContain("token:ponder");
    expect(Dash.zone("arena")).toContain("token:bloodrot-pox");
  });
});
