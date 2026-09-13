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
import { sigilOfSanctuaryBlue } from "./sigil-of-sanctuary.ts";

describe("Sigil of Sanctuary (FLR026) AAA", () => {
  it("happy: Arcane Shelter leave-arena creates an Embodiment of Earth token", () => {
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
        arena: [sigilOfSanctuaryBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(kano).play(volticBoltRed, { target: Briar.id });
    game.untilIdle();

    expectFabCard(Briar, sigilOfSanctuaryBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
  });

  it("boundary: physical combat does not destroy Arcane Shelter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        arena: [sigilOfSanctuaryBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Briar, sigilOfSanctuaryBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);
  });

  it("timing: entering the arena does not create Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sigilOfSanctuaryBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sigilOfSanctuaryBlue);
    game.passBoth();

    expectFabCard(Briar, sigilOfSanctuaryBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);
  });
});
