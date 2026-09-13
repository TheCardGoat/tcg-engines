import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "./fry.ts";
import { staticShockRed } from "./static-shock.ts";
import { fryYellow } from "./fry.ts";
import { staticShockYellow } from "./static-shock.ts";

describe("Static Shock (AUR012) AAA", () => {
  it("happy: after a Lightning card this turn a hit deals 1 extra arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fryRed, staticShockRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fryRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);

    Briar.attackWith(staticShockRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: without a Lightning card played this turn a hit deals only the 4 physical", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [staticShockRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(staticShockRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});

describe("Static Shock (AUR019) AAA", () => {
  it("happy: after a Lightning card this turn a hit deals 1 extra arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fryYellow, staticShockYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(fryYellow);
    game.as(dash).defendWith();
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);

    Briar.playAttack(staticShockYellow);
    expectCombat(game).toHaveAttackPower(3);
    game.as(dash).defendWith();
    game.closeCombat();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    // 2 physical (Fry) + 3 physical + 1 arcane (Lightning Flow).
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: without a Lightning card played this turn a hit deals only the 3 physical", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [staticShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(staticShockYellow);
    game.as(dash).defendWith();
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: Static Shock itself is not a Lightning card, so it does not arm its own Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [staticShockYellow, fryYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(staticShockYellow);
    game.as(dash).defendWith();
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
