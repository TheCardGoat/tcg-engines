import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { meatAndGreetRed } from "./meat-and-greet.ts";

// Printed text has NO inherent go again — the conditional clause is the only
// source ("If you've dealt arcane damage to an opposing hero this turn, this
// gets go again"). The module's unprinted `keywords: [goAgain]` was removed
// by W1-FIX (plan §5), so both directions of the conditional are proven
// below: no prior arcane damage → no refund; Runechant ping → refund.
describe("Meat and Greet (CRU151) AAA", () => {
  it("happy: when this hits, create a Runechant token under your control", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(meatAndGreetRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Briar.zone("arena")).toContain("token:runechant");
    expect(Dash.zone("arena")).not.toContain("token:runechant");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Runechant token", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(meatAndGreetRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, snatchRed]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Briar.zone("arena")).not.toContain("token:runechant");
  });

  it("timing: the hit Runechant pings 1 arcane on the next attack action, then is replaced by the new hit's token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [meatAndGreetRed, meatAndGreetRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);

    Briar.attackWith(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expect(game.combat()).toBeNull();
  });

  it("boundary: with no arcane damage dealt this turn, the attack refunds no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });

    // The hit created a Runechant token but dealt no ARCANE damage this turn:
    // the printed conditional grants no go again, so the action point that
    // paid for the attack stays spent (CR 7.6.2).
    expectFabPlayer(Briar).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
  });

  it("go again: once the Runechant ping has dealt arcane damage, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [meatAndGreetRed, meatAndGreetRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // First copy: hits for 4 and creates a Runechant, but no arcane damage
    // has been dealt yet, so no refund (AP 2 → 1).
    Briar.attackWith(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Briar).toHaveAP(1);

    // Second copy: playing an attack action triggers the Runechant ping
    // (1 arcane damage) before chain-link resolution, so the conditional
    // go again refunds the action point (AP 1 → 0 → 1).
    Briar.attackWith(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
