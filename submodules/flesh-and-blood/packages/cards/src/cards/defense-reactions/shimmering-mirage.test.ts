import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismSculptorOfArcLight } from "../heroes/prism-sculptor-of-arc-light.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shimmeringMirageBlue } from "./shimmering-mirage.ts";

describe("Shimmering Mirage (PEN129) AAA", () => {
  it("happy: when the defended link resolves, this is banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prismSculptorOfArcLight, hand: [shimmeringMirageBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismSculptorOfArcLight);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Prism.must.playReaction(shimmeringMirageBlue);
    game.passBoth();
    expectFabCard(Prism, shimmeringMirageBlue).toBeIn("combatChain");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Prism, shimmeringMirageBlue).toBeIn("banished");
    expectFabPlayer(Prism).toHaveLife(18);
  });

  it("boundary: declining the this-combat-chain play leaves it banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prismSculptorOfArcLight, hand: [shimmeringMirageBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Prism.must.playReaction(shimmeringMirageBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Prism, shimmeringMirageBlue).toBeIn("banished");
  });
});
