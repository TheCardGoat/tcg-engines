import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { openTheGateToIArathaelRed } from "./open-the-gate-to-i-arathael.ts";

describe("Open the Gate to i'Arathael (IAR166) AAA", () => {
  it("happy: when this hits, a Gate to i'Arathael is created under your control", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [openTheGateToIArathaelRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(openTheGateToIArathaelRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Chane.zone("arena")).toContain("token:gate-to-i-arathael");
    expect(Dash.zone("arena")).not.toContain("token:gate-to-i-arathael");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [openTheGateToIArathaelRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(openTheGateToIArathaelRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Chane.zone("arena")).not.toContain("token:gate-to-i-arathael");
    expect(Dash.zone("arena")).not.toContain("token:gate-to-i-arathael");
  });

  it("timing: banished from hand creates the Gate mid-combat, before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [alphaRampageRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: chane, hand: [openTheGateToIArathaelRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Chane = game.as(chane);

    Rhinar.playAttack(alphaRampageRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expect(Chane.zone("banished")).toContain(openTheGateToIArathaelRed.canonicalId);
    expect(game.combat()?.open).toBe(true);
    expectFabPlayer(Chane).toHaveLife(20);
    expect(Chane.zone("arena")).toContain("token:gate-to-i-arathael");

    game.helpers.resolveRestOfCombat();

    expect(Chane.zone("arena")).toContain("token:gate-to-i-arathael");
  });
});
