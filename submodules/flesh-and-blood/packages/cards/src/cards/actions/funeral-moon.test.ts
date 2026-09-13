import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { snatchRed } from "./snatch.ts";
import { funeralMoonRed } from "./funeral-moon.ts";

describe("Funeral Moon (DTD140) AAA", () => {
  it("happy: playing from hand creates a Runechant token", () => {
    const game = FabTestEngine.start(
      { hero: vynnset, hand: [funeralMoonRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(funeralMoonRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Vynnset.zone("arena")).toContain("token:runechant");
    expectFabCard(Vynnset, funeralMoonRed).toBeIn("graveyard");
  });

  it("happy: you may play this from your banished zone and still create a Runechant", () => {
    const game = FabTestEngine.start(
      { hero: vynnset, banished: [funeralMoonRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(funeralMoonRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Vynnset.zone("arena")).toContain("token:runechant");
    expectFabCard(Vynnset, funeralMoonRed).toBeIn("graveyard");
  });

  it("happy: if a hero has lost {h} this turn, you may play this as though it were an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: vynnset, hand: [funeralMoonRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Vynnset = game.as(vynnset);

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Vynnset).toHaveLife(16);
    Dash.pass();
    Vynnset.play(funeralMoonRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Vynnset.zone("arena")).toContain("token:runechant");
    expectFabCard(Vynnset, funeralMoonRed).toBeIn("graveyard");
  });

  it("happy: after a hero loses {h}, the banished-zone copy may be played as an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: vynnset, banished: [funeralMoonRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Vynnset = game.as(vynnset);

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Vynnset).toHaveLife(16);
    Dash.pass();
    Vynnset.play(funeralMoonRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Vynnset.zone("arena")).toContain("token:runechant");
    expectFabCard(Vynnset, funeralMoonRed).toBeIn("graveyard");
  });

  it("boundary: without a hero losing {h} this turn it is not an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: vynnset, hand: [funeralMoonRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Vynnset = game.as(vynnset);

    Dash.play(snatchRed, { target: Vynnset.id });
    Dash.pass();
    expect(() => Vynnset.play(funeralMoonRed)).toThrow();
    expectFabCard(Vynnset, funeralMoonRed).toBeIn("hand");
  });

  it("boundary: Blood Debt loses 1{h} at end of turn while this is banished", () => {
    const game = FabTestEngine.start(
      { hero: vynnset, banished: [funeralMoonRed], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Vynnset, funeralMoonRed).toBeBanished();
    expectFabPlayer(Vynnset).toHaveLife(19);
  });
});
