import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { snatchRed } from "../actions/snatch.ts";
import { feignDeathYellow } from "../instants/feign-death.ts";
import { zapClappers } from "./zap-clappers.ts";

/**
 * Zap Clappers (AST005) — Lightning Runeblade Equipment - Arms.
 *
 * Printed: When this defends, you may reveal an instant card from your hand.
 * If you do, deal 1 arcane damage to the attacking hero. Blade Break.
 */

describe("Zap Clappers (AST005) AAA", () => {
  it("happy: revealing an instant on defense deals 1 arcane to the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: auroraEmissaryOfLightning,
        arms: [zapClappers],
        hand: [feignDeathYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.as(auroraEmissaryOfLightning).defendWith(zapClappers);
    game.untilIdle({ optionals: "accept", ordering: "listed", entityTargets: "maximum" });

    // 1 arcane from the reveal + 2 physical (4{p} - 2{d}).
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabPlayer(game.as(auroraEmissaryOfLightning)).toHaveLife(18);
    expectFabCard(game.as(auroraEmissaryOfLightning), zapClappers).toBeIn("graveyard");
  });

  it("boundary: declining the reveal deals no arcane to the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: auroraEmissaryOfLightning,
        arms: [zapClappers],
        hand: [feignDeathYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.as(auroraEmissaryOfLightning).defendWith(zapClappers);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(game.as(auroraEmissaryOfLightning)).toHaveLife(18);
  });
});
