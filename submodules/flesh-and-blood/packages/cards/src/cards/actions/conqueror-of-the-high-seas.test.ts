import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { conquerorOfTheHighSeasRed } from "./conqueror-of-the-high-seas.ts";

describe("Conqueror of the High Seas (SEA130) AAA", () => {
  it("happy: High Tide with 2 blues in pitch grants +1{p} and go again, and a hit destroys arsenal into Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [conquerorOfTheHighSeasRed],
        pitch: [nimblismBlue, autumnSTouchBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.attackWith(conquerorOfTheHighSeasRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("happy: a hit destroys arsenal and creates a Gold for each card destroyed this way", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [conquerorOfTheHighSeasRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.attackWith(conquerorOfTheHighSeasRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });

  it("boundary: without 2 blues in pitch this stays at printed 7 and has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [conquerorOfTheHighSeasRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(conquerorOfTheHighSeasRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });

  it("boundary: a fully defended attack creates no Gold and leaves arsenal intact", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [conquerorOfTheHighSeasRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, autumnSTouchBlue],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.attackWith(conquerorOfTheHighSeasRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue, autumnSTouchBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(0);
  });
});
