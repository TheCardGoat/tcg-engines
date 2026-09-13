import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { kissOfDeathRed } from "./kiss-of-death.ts";

describe("Kiss of Death (HNT012) AAA", () => {
  it("happy: hitting a hero deals combat damage then they lose 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [kissOfDeathRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(kissOfDeathRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Arakni, kissOfDeathRed).toBeIn("graveyard");
  });

  it("boundary: a miss deals no combat damage and does not lose life", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [kissOfDeathRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(kissOfDeathRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: the extra {h} loss is not combat damage (3 + 1 after the hit)", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [kissOfDeathRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(kissOfDeathRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expect(game.combat()).toBeNull();
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
