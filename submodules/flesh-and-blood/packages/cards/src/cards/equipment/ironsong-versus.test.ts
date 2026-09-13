import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { ironsongVersus } from "./ironsong-versus.ts";

/**
 * Ironsong Versus — Warrior Arms d2 Temper.
 *
 * Printed: "Once per Turn Action - {r}: Your next sword attack this turn gets
 * 'When this hits a hero, create a Courage token.' Go again. Temper"
 */

describe("Ironsong Versus AAA", () => {
  it("happy: the granted sword attack creates a Courage token when it hits", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arms: [ironsongVersus],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(ironsongVersus);
    game.untilIdle();

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
      ordering: "listed",
    });

    expectFabPlayer(Dori).toHaveTokenCount("courage", 1);
  });

  it("boundary: an un-granted sword hit creates no Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arms: [ironsongVersus],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Dori).toHaveTokenCount("courage", 0);
  });

  it("timing: once per turn — a second grant is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arms: [ironsongVersus],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(ironsongVersus);
    game.untilIdle();
    Dori.expectActivationRejected(ironsongVersus);
    expectFabCard(Dori, ironsongVersus).toBeIn("arms");
  });
});
