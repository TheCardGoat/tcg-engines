import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rallyTheRearguardRed } from "./rally-the-rearguard.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { reincarnateRed } from "./reincarnate.ts";

describe("Reincarnate (DYN010) AAA", () => {
  it("happy: random-discard pays and this goes to the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckerRompBlue, reincarnateRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(wreckerRompBlue, { stopAt: "on-attack" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Rhinar.zone("graveyard")).not.toContain(reincarnateRed.canonicalId);
    expect(Rhinar.zone("deck")[0]).toBe(reincarnateRed.canonicalId);
  });

  it("boundary: played as an attack hits for printed power then goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [reincarnateRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(reincarnateRed);
    expectCombat(game).toHaveAttackPower(7);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Rhinar, reincarnateRed).toBeIn("graveyard");
  });

  it("timing: a chosen discard puts this in the graveyard, not the deck bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [rallyTheRearguardRed, reincarnateRed],
        life: 20,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(brutalAssaultBlue);
    Rhinar.defendWith(rallyTheRearguardRed);
    game.toReaction("defender");
    Rhinar.activate(rallyTheRearguardRed);

    expectFabCard(Rhinar, reincarnateRed).toBeIn("graveyard");
    expect(Rhinar.zone("deck")[0]).toBe(brutalAssaultBlue.canonicalId);
  });
});
