import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { fai } from "../heroes/fai.ts";
import { searingEmberblade } from "./searing-emberblade.ts";

describe("Searing Emberblade (FAI002) AAA", () => {
  it("happy: activate attacks for 3", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [searingEmberblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(searingEmberblade);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("happy: two Draconic chain links — Emberblade attacks get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [searingEmberblade],
        hand: [phoenixFlameRed, phoenixFlameRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    const flames = Fai.cardsIn("hand", phoenixFlameRed);
    Fai.must.playAttack(flames[0]!);
    game.advanceCombatTo("resolution");
    Fai.must.playAttack(flames[1]!);
    game.advanceCombatTo("resolution");
    Fai.must.activate(searingEmberblade);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: without 2 Draconic chain links the attack does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [searingEmberblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(searingEmberblade);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expect(Fai.actionPoints()).toBe(0);
  });
});
