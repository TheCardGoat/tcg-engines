import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { agileWindupRed } from "./agile-windup.ts";

describe("Agile Windup family AAA", () => {
  it("happy: Instant — discard this creates an Agility token", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [agileWindupRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(agileWindupRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Fai, agileWindupRed).toBeIn("graveyard");
    expect(Fai.zone("arena")).toContain("token:agility");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: attacking with Agile Windup does not create an Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [agileWindupRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(agileWindupRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expect(Fai.zone("arena")).not.toContain("token:agility");
    expectFabCard(Fai, agileWindupRed).toBeIn("graveyard");
  });
});
