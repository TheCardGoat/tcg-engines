import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { maleficIncantationRed } from "./malefic-incantation.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { nimblismBlue } from "./nimblism.ts";
import { miragingMetamorphRed } from "./miraging-metamorph.ts";

describe("Miraging Metamorph (EVR139) AAA", () => {
  it("happy: phantasm destroy creates a token copy of an aura you control", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [miragingMetamorphRed],
        arena: [maleficIncantationRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(miragingMetamorphRed);
    expect(game.combat()?.activeLink?.keywords).toContain("phantasm");
    game.advanceCombatTo("defend");
    Dash.defendWith(regurgitatingSlogRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Zyggy, miragingMetamorphRed).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
    expectFabPlayer(Dash).toHaveLife(20);
    expect(
      Zyggy.zone("arena").filter((id) => id === maleficIncantationRed.canonicalId).length,
    ).toBeGreaterThan(1);
  });

  it("boundary: a low-power defender does not destroy this and no copy is created", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [miragingMetamorphRed],
        arena: [maleficIncantationRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(miragingMetamorphRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Zyggy, miragingMetamorphRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
    expect(
      Zyggy.zone("arena").filter((id) => id === maleficIncantationRed.canonicalId),
    ).toHaveLength(1);
  });
});
