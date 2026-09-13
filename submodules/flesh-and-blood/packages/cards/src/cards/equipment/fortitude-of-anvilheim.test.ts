import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fortitudeOfAnvilheim } from "./fortitude-of-anvilheim.ts";

describe("Fortitude of Anvilheim (OMN242) AAA", () => {
  it("happy: Attack Reaction returns the defending action to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [cintariSaber],
        weapon2: [fortitudeOfAnvilheim],
        hand: [],
        actionPoints: 1,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activateAttack(cintariSaber);
    Dash.defendWith(nimblismBlue);
    game.toReaction("attacker");
    Bravo.activate(fortitudeOfAnvilheim);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Bravo, fortitudeOfAnvilheim).toBeIn("graveyard");
  });

  it("boundary: with no defending action the Reaction is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [fortitudeOfAnvilheim],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).expectActivationRejected(fortitudeOfAnvilheim);
    expectFabCard(game.as(bravo), fortitudeOfAnvilheim).toBeIn("weapon2");
  });
});
