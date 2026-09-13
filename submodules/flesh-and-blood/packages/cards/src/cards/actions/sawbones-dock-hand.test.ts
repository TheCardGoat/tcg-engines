import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { sawbonesDockHandYellow } from "./sawbones-dock-hand.ts";

describe("Sawbones, Dock Hand (AGB019) AAA", () => {
  it("happy: tap and pay {r} to attack for printed 6", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [sawbonesDockHandYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(sawbonesDockHandYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Gravy, sawbonesDockHandYellow).toBeIn("arena");

    Gravy.activate(sawbonesDockHandYellow, {
      abilityId: `${sawbonesDockHandYellow.canonicalId}:actionResourceTAttack`,
    });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expectFabCard(Gravy, sawbonesDockHandYellow).toBeTapped();
  });

  it("happy: Instant prevention stops 1 of the next damage to you this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: gravyBones, arena: [sawbonesDockHandYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Dash.pass();
    Gravy.activate(sawbonesDockHandYellow, {
      abilityId: `${sawbonesDockHandYellow.canonicalId}:instantTNextTimePirateControlWouldDealtDamageTurnPreventNumber1`,
    });
    game.helpers.resolveUntilIdle();
    expectFabCard(Gravy, sawbonesDockHandYellow).toBeTapped();

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Gravy).toHaveLife(17);
  });

  it("timing: prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [sawbonesDockHandYellow], deck: 6 },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(sawbonesDockHandYellow, {
      abilityId: `${sawbonesDockHandYellow.canonicalId}:instantTNextTimePirateControlWouldDealtDamageTurnPreventNumber1`,
    });
    game.helpers.resolveUntilIdle();
    Gravy.endTurn();
    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Gravy).toHaveLife(16);
  });
});
