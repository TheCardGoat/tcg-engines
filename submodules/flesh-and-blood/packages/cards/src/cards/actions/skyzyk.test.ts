import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { embodimentOfLightning } from "../tokens/embodiment-of-lightning.ts";
import { skyzykRed } from "./skyzyk.ts";

describe("Skyzyk (AST013) AAA", () => {
  it("happy: if this has go again it gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [skyzykRed],
        arena: [embodimentOfLightning],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(skyzykRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: without go again this stays at printed 3", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [skyzykRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(skyzykRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });

  it("timing: go again granted on play is visible to the continuous +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [skyzykRed],
        arena: [embodimentOfLightning],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(skyzykRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.as(briar).zone("arena")).not.toContain("token:embodiment-of-lightning");
  });
});
