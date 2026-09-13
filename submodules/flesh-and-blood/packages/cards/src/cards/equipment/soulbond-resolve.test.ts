import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { soulbondResolve } from "./soulbond-resolve.ts";

/**
 * Soulbond Resolve (DTD047) — Light Warrior Chest d2, Temper.
 *
 * Printed: "When this defends, you may charge your hero's soul. / The first
 * time you would be dealt damage each turn, if you've charged this turn,
 * prevent 1 of that damage. / Temper"
 */

describe("Soulbond Resolve (DTD047) AAA", () => {
  it("happy: defending charges a card and the first damage of the turn is reduced by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        chest: [soulbondResolve],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Boltyn.defendWith(soulbondResolve);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    // 4{p} vs d2 = 2 damage; the charged prevention takes the first 1 away.
    expectFabPlayer(Boltyn).toHaveLife(19);
  });

  it("boundary: declining the charge means no prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        chest: [soulbondResolve],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Boltyn.defendWith(soulbondResolve);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectFabPlayer(Boltyn).toHaveLife(18); // 2 damage, nothing prevented
  });

  it("timing: only the first damage each turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        chest: [soulbondResolve],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // First attack: charge and prevent 1 (life 20 → 19).
    Dash.playAttack(snatchRed);
    Boltyn.defendWith(soulbondResolve);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });
    expectFabPlayer(Boltyn).toHaveLife(19);

    // Second attack the same turn: no further prevention (decline the block).
    Dash.playAttack(snatchRed);
    Boltyn.defendWith();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Boltyn).toHaveLife(15); // full 4{p}
  });
});
