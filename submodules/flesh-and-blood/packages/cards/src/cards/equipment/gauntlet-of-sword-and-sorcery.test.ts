import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gauntletOfSwordAndSorcery } from "./gauntlet-of-sword-and-sorcery.ts";

describe("Gauntlet of Sword and Sorcery (OMN086) AAA", () => {
  it("happy: tap this and the hero so the next AAC deals 1 arcane and gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [gauntletOfSwordAndSorcery],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.activate(gauntletOfSwordAndSorcery);
    game.helpers.resolveUntilIdle();
    expectFabCard(Viserai, gauntletOfSwordAndSorcery).toBeTapped();
    Viserai.playAttack(snatchRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Viserai.target(Dash);
    }
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without activating, Snatch stays 4 power and deals 4", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [gauntletOfSwordAndSorcery],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: the Action is illegal without 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [gauntletOfSwordAndSorcery],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.expectActivationRejected(gauntletOfSwordAndSorcery);
    expectFabCard(Viserai, gauntletOfSwordAndSorcery).toBeIn("arms");
  });
});
