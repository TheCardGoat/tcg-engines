import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ticketPuncher } from "./ticket-puncher.ts";

describe("Ticket Puncher (HVY204) AAA", () => {
  it("happy: opponent with greater {h} sets this to 1{d}; defend then Blade Break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 15, arms: [ticketPuncher], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, ticketPuncher).toHaveDefense(1);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ticketPuncher);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(12);
    expectFabCard(Bravo, ticketPuncher).toBeIn("graveyard");
  });

  it("boundary: equal life sets this to 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [ticketPuncher], life: 20, hand: [], deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), ticketPuncher).toHaveDefense(0);
    expectFabCard(game.as(bravo), ticketPuncher).toHaveKeyword("blade-break");
  });

  it("timing: Blade Break destroys this after it defends at 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 20, arms: [ticketPuncher], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ticketPuncher);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, ticketPuncher).toBeIn("graveyard");
  });
});
