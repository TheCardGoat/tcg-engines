import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { emergingPowerRed } from "./emerging-power.ts";
import { cutThroughTheFacadeRed } from "./cut-through-the-facade.ts";

describe("Cut Through the Facade (ROS216) AAA", () => {
  it("happy: unblocked hit may destroy an aura they control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutThroughTheFacadeRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], arena: [emergingPowerRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(cutThroughTheFacadeRed);
    expectCombat(game).toHaveAttackPower(7);
    game.advanceUntil({ stopAt: "idle", optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(13);
    expectFabCard(game.as(dash), cutThroughTheFacadeRed).toBeIn("graveyard");
    expectFabCard(Bravo, emergingPowerRed).toBeIn("graveyard");
  });

  it("boundary: declining the on-hit optional leaves their aura", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutThroughTheFacadeRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], arena: [emergingPowerRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(cutThroughTheFacadeRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(13);
    expectFabCard(Bravo, emergingPowerRed).toBeIn("arena");
  });

  it("timing: combat closes after the printed attack resolves", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutThroughTheFacadeRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).playAttack(cutThroughTheFacadeRed);
    expectCombat(game).toBeAtStep("defend");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(bravo)).toHaveLife(13);
  });
});
