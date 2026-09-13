import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { snatchRed } from "./snatch.ts";
import { riftSkitterRed } from "./rift-skitter.ts";
import { envelopInDarknessRed } from "./envelop-in-darkness.ts";
import { envelopInDarknessBlue } from "./envelop-in-darkness.ts";

describe("Envelop in Darkness (DTD149) AAA", () => {
  it("happy: creates a Runechant and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle();
    expect(Briar.zone("arena")).toContain("token:runechant");
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, envelopInDarknessRed).toBeIn("graveyard");
  });

  it("happy: the next rune-gated attack action gets +3{p}", () => {
    const runechant = fabToken("runechant");
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [envelopInDarknessRed],
        banished: [riftSkitterRed],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(riftSkitterRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: a non-rune-gated attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [envelopInDarknessRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("happy: creates a Runechant and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [envelopInDarknessBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(envelopInDarknessBlue);
    game.helpers.resolveUntilIdle();
    expect(Briar.zone("arena")).toContain("token:runechant");
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, envelopInDarknessBlue).toBeIn("graveyard");
  });
});
