import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { coalescenceMirageBlue } from "../actions/coalescence-mirage.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { silentStilettos } from "./silent-stilettos.ts";

describe("Silent Stilettos (UPR152) AAA", () => {
  it("happy: paying {r}{r}{r} after a phantasm destroy destroys this and refunds an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        legs: [silentStilettos],
        hand: [coalescenceMirageBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageBlue);
    game.as(dash).defendWith(regurgitatingSlogRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Prism, silentStilettos).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveAP(1);
  });

  it("boundary: declining the pay leaves the legs equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        legs: [silentStilettos],
        hand: [coalescenceMirageBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageBlue);
    game.as(dash).defendWith(regurgitatingSlogRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Prism, silentStilettos).toBeIn("legs");
    expectFabPlayer(Prism).toHaveAP(0);
  });

  it("timing: without a phantasm destroy the legs stay equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        legs: [silentStilettos],
        hand: [coalescenceMirageBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Prism, silentStilettos).toBeIn("legs");
  });
});
