import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { scoobaSaltySeaDogYellow } from "./scooba-salty-sea-dog.ts";

describe("Scooba, Salty Sea Dog (SEA061) AAA", () => {
  it("happy: attacking may bottom a yellow graveyard card and create a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scoobaSaltySeaDogYellow],
        graveyard: [tomeOfFyendalYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scoobaSaltySeaDogYellow);
    game.helpers.resolveUntilIdle();
    Gravy.activate(scoobaSaltySeaDogYellow);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(Gravy.zone("arena")).toContain("token:gold");
  });

  it("boundary: declining the yellow-bottom optional creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scoobaSaltySeaDogYellow],
        graveyard: [tomeOfFyendalYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scoobaSaltySeaDogYellow);
    game.helpers.resolveUntilIdle();
    Gravy.activate(scoobaSaltySeaDogYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Gravy, tomeOfFyendalYellow).toBeIn("graveyard");
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(0);
  });

  it("boundary: a blue graveyard card is not a legal yellow-bottom target", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scoobaSaltySeaDogYellow],
        graveyard: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scoobaSaltySeaDogYellow);
    game.helpers.resolveUntilIdle();
    Gravy.activate(scoobaSaltySeaDogYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Gravy, nimblismBlue).toBeIn("graveyard");
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(0);
  });
});
