import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  type FabPlayerSetup,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { aurora } from "../heroes/aurora.ts";
import { lightningSurgeRed } from "../actions/lightning-surge.ts";
import { flowstateEmbodimentRed } from "../actions/flowstate-embodiment.ts";
import { scorpioCometTail } from "./scorpio-comet-tail.ts";

type HiddenZone =
  | "hand"
  | "deck"
  | "graveyard"
  | "banished"
  | "arsenal"
  | "pitch"
  | "soul"
  | "inventory";

function auroraWithHiddenLightningAttack(zone: HiddenZone): FabPlayerSetup {
  const setup: FabPlayerSetup = {
    hero: aurora,
    weapon1: [scorpioCometTail],
    actionPoints: 1,
    deck: zone === "deck" ? [flowstateEmbodimentRed] : 6,
  };
  if (zone !== "deck") setup[zone] = [flowstateEmbodimentRed];
  return setup;
}

describe("Scorpio, Comet Tail (OMN049) AAA", () => {
  it("happy: after a Lightning attack, activates for 1{p} and deals 1 arcane on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [scorpioCometTail],
        hand: [lightningSurgeRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);
    const Dash = game.as(dash);

    Aurora.attackWith(lightningSurgeRed);
    game.advanceCombatTo("resolution");
    Aurora.activate(scorpioCometTail);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);

    game.helpers.resolveRestOfCombat();
    // Lightning Surge 4 + Scorpio 1 physical + 1 arcane on hit.
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: cannot activate without a Lightning attack", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [scorpioCometTail],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(aurora).expectActivationRejected(scorpioCometTail);
  });

  it.each<HiddenZone>([
    "hand",
    "deck",
    "graveyard",
    "banished",
    "arsenal",
    "pitch",
    "soul",
    "inventory",
  ])("control boundary: a Lightning attack in %s does not unlock Scorpio", (zone) => {
    const game = FabTestEngine.start(
      auroraWithHiddenLightningAttack(zone),
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(aurora).expectActivationRejected(scorpioCometTail);
  });
});
