import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { prism } from "../heroes/prism.ts";
import { prismaticShieldRed } from "./prismatic-shield.ts";

describe("Prismatic Shield family AAA", () => {
  it("happy: the red printing creates exactly three Spectral Shield tokens", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [prismaticShieldRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(prismaticShieldRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 3);
    expectFabPlayer(Prism).toHaveResourceCount(0);
    expectFabPlayer(Prism).toHaveAP(1);
    expectFabCard(Prism, prismaticShieldRed).toBeIn("graveyard");
  });

  it("boundary: an unpayable red printing remains in hand and creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [prismaticShieldRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    expectFabUnplayable(() => Prism.play(prismaticShieldRed));
    expectFabCard(Prism, prismaticShieldRed).toBeIn("hand");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
    expectFabPlayer(Prism).toHaveResourceCount(2);
  });

  it("timing: the red printing is playable in a reaction window without spending AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 6, actionPoints: 1, deck: 6 },
      { hero: prism, hand: [prismaticShieldRed], resourcePoints: 3, deck: 6 },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Prism.play(prismaticShieldRed);

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 3);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Prism, prismaticShieldRed).toBeIn("graveyard");
  });
});
