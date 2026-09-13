import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { marlynn } from "../heroes/marlynn.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { readTheGlidePathYellow } from "./read-the-glide-path.ts";
import { pilferTheWreckRed } from "./pilfer-the-wreck.ts";

/**
 * Pilfer the Wreck (SEA138) — Pirate Attack. Red cost 3, 7{p}/2{d}.
 * When this hits a hero, you may turn a card in their GY face-down. If it's yellow, create a Gold token.
 */

describe("Pilfer the Wreck family AAA", () => {
  it("happy: hit turns a yellow GY card face-down and creates Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [pilferTheWreckRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        graveyard: [readTheGlidePathYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.playAttack(pilferTheWreckRed);
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Marlynn).toHaveTokenCount("gold", 1);
  });

  it("boundary: a blocked miss does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [pilferTheWreckRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, wreckerRompBlue, nimblismBlue],
        graveyard: [readTheGlidePathYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);
    const Dash = game.as(dash);

    Marlynn.playAttack(pilferTheWreckRed);
    Dash.defendWith(nimblismBlue, wreckerRompBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Marlynn).toHaveTokenCount("gold", 0);
  });

  it("timing: declining the optional creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [pilferTheWreckRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        graveyard: [readTheGlidePathYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.playAttack(pilferTheWreckRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Marlynn).toHaveTokenCount("gold", 0);
  });
});
