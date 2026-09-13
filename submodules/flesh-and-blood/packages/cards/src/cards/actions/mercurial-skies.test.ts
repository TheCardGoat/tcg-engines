import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { heavenSClawsRed } from "./heaven-s-claws.ts";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { mercurialSkiesRed } from "./mercurial-skies.ts";

/**
 * Mercurial Skies (OMN059) — Lightning Runeblade Action, cost 0, go again.
 *
 * Printed: The next Runeblade or Lightning attack action card you play this
 * turn gets go again and "The first time this deals damage to a hero, you may
 * destroy a Lightning Flow you control. If you do, deal 3 arcane damage to
 * them."
 */

describe("Mercurial Skies family AAA", () => {
  it("happy: the next Lightning attack action gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [mercurialSkiesRed, heavenSClawsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.play(mercurialSkiesRed);
    game.untilIdle({ optionals: "decline" });
    Aurora.playAttack(heavenSClawsRed);

    expectCombat(game).toHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Aurora, mercurialSkiesRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [mercurialSkiesRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.play(mercurialSkiesRed);
    game.untilIdle({ optionals: "decline" });
    Aurora.playAttack(brutalAssaultBlue);

    expectCombat(game).notToHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: first damage may destroy a Lightning Flow to deal 3 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [mercurialSkiesRed, heavenSClawsRed],
        arena: [fabToken("lightning-flow")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.play(mercurialSkiesRed);
    game.untilIdle({ optionals: "decline" });
    Aurora.playAttack(heavenSClawsRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabPlayer(Aurora).toHaveTokenCount("lightning-flow", 0);
  });
});
