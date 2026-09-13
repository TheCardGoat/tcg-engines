import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { nimblismBlue } from "./nimblism.ts";
import { loanSharkYellow } from "./loan-shark.ts";

describe("Loan Shark (SEA131) AAA", () => {
  it("happy: enters the arena and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [loanSharkYellow], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(loanSharkYellow);
    game.passBoth();

    expectFabCard(Gravy, loanSharkYellow).toBeIn("arena");
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("happy: when this enters the arena, create 2 Gold tokens", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [loanSharkYellow], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(loanSharkYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, loanSharkYellow).toBeIn("arena");
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(2);
  });

  it("boundary: end phase with no Gold created or stolen this turn destroys this and taxes 2 life", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [loanSharkYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const lifeBefore = Gravy.life();

    Gravy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Gravy, loanSharkYellow).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveLife(lifeBefore - 2);
  });

  it("timing: discarding a card at end phase avoids the 2 life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [loanSharkYellow],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const lifeBefore = Gravy.life();

    Gravy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Gravy, loanSharkYellow).toBeIn("graveyard");
    expectFabCard(Gravy, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveLife(lifeBefore);
  });
});
