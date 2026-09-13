import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "./fry.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { entwineLightningRed } from "./entwine-lightning.ts";
import { weaveLightningRed } from "./weave-lightning.ts";

describe("Weave Lightning family AAA", () => {
  it("happy: the next Lightning attack action gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveLightningRed, fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveLightningRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(fryRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: Autumn's Touch is Earth-only and does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveLightningRed, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveLightningRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(autumnSTouchBlue);

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("synergy: a fused Lightning/Elemental attack also gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveLightningRed, entwineLightningRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveLightningRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(entwineLightningRed, { fuse: true, fuseCards: [lightningPressRed] });

    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
