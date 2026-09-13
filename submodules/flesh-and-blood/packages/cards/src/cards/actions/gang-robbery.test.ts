import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gangRobberyYellow } from "./gang-robbery.ts";

describe("Gang Robbery (SUP085) AAA", () => {
  it("happy: attacking a hero steals an aura token they control", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gangRobberyYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [spectralShield], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(gangRobberyYellow);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expect(Bravo.zone("arena")).toContain(spectralShield.canonicalId);
    expect(Dash.zone("arena")).not.toContain(spectralShield.canonicalId);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: with no aura token, the attack still deals 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gangRobberyYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(gangRobberyYellow);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: stolen aura returns at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gangRobberyYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [spectralShield], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(gangRobberyYellow);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expect(Bravo.zone("arena")).toContain(spectralShield.canonicalId);

    Bravo.endTurn();

    expect(Dash.zone("arena")).toContain(spectralShield.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(spectralShield.canonicalId);
  });
});
