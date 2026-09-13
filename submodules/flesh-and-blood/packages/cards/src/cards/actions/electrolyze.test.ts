import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { electrolyzeRed } from "./electrolyze.ts";

describe("Electrolyze (OMN163) AAA", () => {
  it("happy: hits for printed 4 and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [electrolyzeRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(electrolyzeRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Briar, electrolyzeRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: a vanilla Earth attack without go again spends the action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [autumnSTouchBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(autumnSTouchBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("timing: go again refunds at chain-link resolution, not on declaration", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [electrolyzeRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(electrolyzeRed);
    expectFabPlayer(Briar).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
