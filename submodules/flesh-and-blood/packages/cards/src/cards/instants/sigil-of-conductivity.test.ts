import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { kano } from "../heroes/kano.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfConductivityBlue } from "./sigil-of-conductivity.ts";

describe("Sigil of Conductivity (OSC024) AAA", () => {
  it("happy: Arcane Shelter leave-arena creates an Embodiment of Lightning token", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: briar,
        arena: [sigilOfConductivityBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(kano).play(volticBoltRed, { target: Briar.id });
    game.untilIdle();

    expectFabCard(Briar, sigilOfConductivityBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
  });

  it("boundary: physical combat does not destroy Arcane Shelter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        arena: [sigilOfConductivityBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Briar, sigilOfConductivityBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("timing: entering the arena does not create Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sigilOfConductivityBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sigilOfConductivityBlue);
    game.passBoth();

    expectFabCard(Briar, sigilOfConductivityBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
