import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { surgingStrikeBlue } from "./surging-strike.ts";
import { descendentGustwaveBlue } from "./descendent-gustwave.ts";
import { bondsOfAncestryBlue } from "./bonds-of-ancestry.ts";
import { nimblismBlue } from "./nimblism.ts";
import { dishonorBlue } from "./dishonor.ts";

describe("Dishonor (OUT051) AAA", () => {
  it("happy: a hit with the three named cards on this chain closes without a status throw", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [surgingStrikeBlue, descendentGustwaveBlue, bondsOfAncestryBlue, dishonorBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(surgingStrikeBlue);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed", optionals: "decline" });
    Katsu.playAttack(descendentGustwaveBlue);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed", optionals: "decline" });
    Katsu.playAttack(bondsOfAncestryBlue);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed", optionals: "decline" });
    Katsu.playAttack(dishonorBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectWait(game).toBeIdle();
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [dishonorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(katsu).playAttack(dishonorBlue);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
