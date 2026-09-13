import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { seduceSecretsYellow } from "./seduce-secrets.ts";

describe("Seduce Secrets (HVY212) AAA", () => {
  it("happy: playing from arsenal draws 1 and the card goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [],
        arsenal: [seduceSecretsYellow],
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], deck: [snatchRed], life: 20 },
    );
    const Dash = game.as(dash);

    Dash.play(seduceSecretsYellow, { from: "arsenal", target: game.as(bravo).id });

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, seduceSecretsYellow).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("boundary: playing from hand does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seduceSecretsYellow],
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], deck: [snatchRed] },
    );
    const Dash = game.as(dash);

    Dash.play(seduceSecretsYellow, { target: game.as(bravo).id });

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, seduceSecretsYellow).toBeIn("graveyard");
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
  });

  it("timing: targeting the opposing hero is legal and opponent zones stay put", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seduceSecretsYellow],
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: [nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(seduceSecretsYellow, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, seduceSecretsYellow).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });
});
