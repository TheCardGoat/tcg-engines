import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { pathOfSameEndsRed } from "./path-of-same-ends.ts";

describe("Path of Same Ends (OMN065) AAA", () => {
  it("happy: on attack deals 1 arcane and gains go again if that damage is dealt", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pathOfSameEndsRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(pathOfSameEndsRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    // 3 physical + 1 on-attack arcane.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: without Path of Same Ends a vanilla attack does not deal on-attack arcane or gain go again", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pathOfSameEndsRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(pathOfSameEndsRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();
    // 3 physical + 1 on-attack arcane; contrasting vanilla would deal only physical.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: go again refunds at chain-link resolution after the on-attack grant", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pathOfSameEndsRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(pathOfSameEndsRed);
    expectFabPlayer(Briar).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
