import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { ebbingArcstrideRed } from "./ebbing-arcstride.ts";

describe("Ebbing Arcstride (AZS008) AAA", () => {
  it("happy: a 2-defense block fragments this and grants go again", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [ebbingArcstrideRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(ebbingArcstrideRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Zyggy, ebbingArcstrideRed).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveAP(1);
  });

  it("boundary: an unblocked attack does not fragment and does not gain go again", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [ebbingArcstrideRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(ebbingArcstrideRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Zyggy).toHaveAP(0);
  });
});
