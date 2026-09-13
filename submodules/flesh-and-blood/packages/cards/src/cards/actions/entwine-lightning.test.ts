import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { entwineLightningRed } from "./entwine-lightning.ts";

describe("Entwine Lightning family AAA", () => {
  it("happy: Lightning fusion grants go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [entwineLightningRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(entwineLightningRed, { fuse: true, fuseCards: [lightningPressRed] });
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Briar, entwineLightningRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: without fusion it does not gain go again", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [entwineLightningRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(entwineLightningRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
