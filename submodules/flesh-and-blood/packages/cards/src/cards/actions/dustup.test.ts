import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ash } from "../tokens/ash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { dustupRed } from "./dustup.ts";

/**
 * Dustup (DRO014) — Draconic Illusionist Action - Attack. Red 0-cost 4{p}/3{d}.
 * When this hits, create an Ash token, then transform up to 1 ash you control
 * into an Aether Ashwing.
 */

describe("Dustup (DRO014) AAA", () => {
  it("happy: when this hits, create an Ash then transform it into an Aether Ashwing", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [dustupRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(dustupRed);
    game.closeCombat({ entityTargets: "maximum" });

    expect(Dromai.zone("arena")).toContain("token:ash");
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });

  it("boundary: a blocked miss creates no Ash and no Ashwing", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [dustupRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    Dromai.playAttack(dustupRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expect(Dromai.zone("arena")).not.toContain("token:aether-ashwing");
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: transform is up to 1 — a second Ash remains after converting one", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [dustupRed],
        arena: [ash],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(dustupRed);
    game.closeCombat({ entityTargets: "maximum" });

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });
});
