import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { crownOfProvidence } from "./crown-of-providence.ts";

describe("Crown of Providence (UPR182) AAA", () => {
  it("happy: defending and putting a hand card on the bottom draws a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [crownOfProvidence],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(crownOfProvidence);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveHandCount(1).toHaveLife(18);
    expectFabCard(Bravo, crownOfProvidence).toBeIn("graveyard");
  });

  it("boundary: declining the optional bottoms nothing and draws nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [crownOfProvidence],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(crownOfProvidence);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expect(Bravo.zone("deck")).not.toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabCard(Bravo, crownOfProvidence).toBeIn("graveyard");
  });

  it("timing: a co-defender alone does not fire Crown", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [crownOfProvidence],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(nimblismBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Bravo, crownOfProvidence).toBeIn("head");
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expect(Bravo.zone("deck")).not.toContain(nimblismBlue.canonicalId);
  });
});
