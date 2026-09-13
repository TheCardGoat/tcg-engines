import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { regurgitatingSlogYellow } from "../actions/regurgitating-slog.ts";
import { snatchRed } from "../actions/snatch.ts";
import { figmentOfRebirthYellow } from "./figment-of-rebirth.ts";

describe("Figment of Rebirth (DTD009) AAA", () => {
  it("happy: entering the arena may put a yellow action from graveyard on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfRebirthYellow],
        graveyard: [regurgitatingSlogYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfRebirthYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Prism, figmentOfRebirthYellow).toBeIn("arena");
    expect(Prism.zone("deck").at(-1)).toBe(regurgitatingSlogYellow.canonicalId);
  });

  it("boundary: a red action in graveyard is not returned", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfRebirthYellow],
        graveyard: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfRebirthYellow);
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Prism, figmentOfRebirthYellow).toBeIn("arena");
    expectFabCard(Prism, snatchRed).toBeIn("graveyard");
  });

  it("timing: declining the enter optional leaves the yellow action in graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfRebirthYellow],
        graveyard: [regurgitatingSlogYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfRebirthYellow);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Prism, figmentOfRebirthYellow).toBeIn("arena");
    expectFabCard(Prism, regurgitatingSlogYellow).toBeIn("graveyard");
  });
});
