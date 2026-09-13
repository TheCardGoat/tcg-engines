import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { runechant } from "../tokens/runechant.ts";
import { sigilOfDeadwoodBlue } from "../actions/sigil-of-deadwood.ts";
import { bloodtornBodice } from "./bloodtorn-bodice.ts";

describe("Bloodtorn Bodice (AUA004) AAA", () => {
  it("happy: destroy this and an aura you control to gain 1{r} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodtornBodice],
        arena: [sigilOfDeadwoodBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.activate(bloodtornBodice);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, bloodtornBodice).toBeIn("graveyard");
    expectFabCard(Viserai, sigilOfDeadwoodBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveResourceCount(1).toHaveAP(1);
  });

  it("boundary: cannot activate without an aura you control", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodtornBodice],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(viserai).expectActivationRejected(bloodtornBodice);
    expectFabCard(game.as(viserai), bloodtornBodice).toBeIn("chest");
    expectFabPlayer(game.as(viserai)).toHaveResourceCount(0).toHaveAP(1);
  });

  it("timing: destroying a token aura as the cost ceases it instead of sending it to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodtornBodice],
        arena: [runechant],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.activate(bloodtornBodice);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, bloodtornBodice).toBeIn("graveyard");
    expect(Viserai.zone("arena")).not.toContain(runechant.canonicalId);
    expect(Viserai.zone("graveyard")).not.toContain(runechant.canonicalId);
    expectFabPlayer(Viserai).toHaveResourceCount(1).toHaveAP(1);
  });
});
