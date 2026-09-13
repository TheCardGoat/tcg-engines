import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { ballLightningRed } from "./ball-lightning.ts";
import { flitteringChargeRed } from "./flittering-charge.ts";

describe("Flittering Charge (AUA008) AAA", () => {
  it("happy: an instant played this chain link grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [flitteringChargeRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flitteringChargeRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.passBoth();
    Oscilio.must.playInstant(lightningPressRed);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Oscilio, flitteringChargeRed).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveAP(1);
  });

  it("boundary: without an instant this chain link it has no go again", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flitteringChargeRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flitteringChargeRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Oscilio).toHaveAP(0);
  });

  it("timing: an instant on an earlier combat chain does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [ballLightningRed, lightningPressRed, flitteringChargeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.playAttack(ballLightningRed);
    game.toReaction("attacker");
    Oscilio.play(lightningPressRed);
    Oscilio.target(ballLightningRed);
    game.closeCombat();

    Oscilio.playAttack(flitteringChargeRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oscilio).toHaveAP(0);
  });
});
