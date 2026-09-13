import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { orbitoclast } from "../weapons/orbitoclast.ts";
import { lobotomyRed } from "./lobotomy.ts";

/**
 * Lobotomy (PEN141) — Assassin Action - Attack, cost 0, 3{p}, Stealth.
 *
 * Printed: When this attacks, you may equip an Orbitoclast from your inventory.
 */

describe("Lobotomy (PEN141) AAA", () => {
  it("happy: attacking may equip Orbitoclast from inventory", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [lobotomyRed],
        inventory: [orbitoclast],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(lobotomyRed, { stopAt: "on-attack" });
    Uzuri.accept();
    Uzuri.target(orbitoclast);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabCard(Uzuri, orbitoclast).toBeIn("weapon1");
  });

  it("boundary: empty inventory does not open the equip boolean", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [lobotomyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(lobotomyRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
  });

  it("timing: declining leaves Orbitoclast in inventory", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [lobotomyRed],
        inventory: [orbitoclast],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(lobotomyRed, { stopAt: "on-attack" });
    Uzuri.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expect(Uzuri.zone("inventory")).toHaveLength(1);
  });
});
