import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dash } from "./dash.ts";
import { convectionAmplifierRed as convectionAmplifier } from "../actions/convection-amplifier.ts";
import { inductionChamberRed as inductionChamber } from "../actions/induction-chamber.ts";
import { tekloPlasmaPistol } from "../weapons/teklo-plasma-pistol.ts";

/** AAA acceptance — Dash (ARC002) and Teklo Plasma Pistol (ARC003). */

describe("Dash + Teklo Plasma Pistol AAA (ARC002/ARC003)", () => {
  it("starts with a Mechanologist item in arena, then reloads and attacks with her pistol", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          inductionChamber,
        ],
        startGame: [inductionChamber],
        weapon1: [tekloPlasmaPistol],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("arena")).toContain(inductionChamber.canonicalId);

    Dash.activate(tekloPlasmaPistol, {
      abilityId: `${tekloPlasmaPistol.canonicalId}:actionResourceThereNoSteamCountersTekloPlasmaPistolPutSteamCounterGoAgain`,
    });
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Dash, Dash.cardIn("weapon1", tekloPlasmaPistol)).toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveAP(2);

    Dash.activate(tekloPlasmaPistol, {
      abilityId: `${tekloPlasmaPistol.canonicalId}:actionRemoveSteamCounterTekloPlasmaPistolAttack`,
    });
    game.passBoth();
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });

  it("allows a cost-0 Mechanologist item at start of game", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          convectionAmplifier,
        ],
        startGame: [convectionAmplifier],
      },
      { hero: bravo, deck: 6 },
    );

    const Dash = game.as(dash);
    expect(Dash.zone("arena")).toContain(convectionAmplifier.canonicalId);
    expect(Dash.zone("deck")).not.toContain(convectionAmplifier.canonicalId);
  });

  it("does not add a second steam counter when reloading an already-loaded pistol", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloPlasmaPistol],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(tekloPlasmaPistol, {
      abilityId: `${tekloPlasmaPistol.canonicalId}:actionResourceThereNoSteamCountersTekloPlasmaPistolPutSteamCounterGoAgain`,
    });
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Dash, Dash.cardIn("weapon1", tekloPlasmaPistol)).toHaveCounters(1, "steam");
    Dash.activate(tekloPlasmaPistol, {
      abilityId: `${tekloPlasmaPistol.canonicalId}:actionResourceThereNoSteamCountersTekloPlasmaPistolPutSteamCounterGoAgain`,
    });
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Dash, Dash.cardIn("weapon1", tekloPlasmaPistol)).toHaveCounters(1, "steam");
  });
});
