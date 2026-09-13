import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { hurlRed } from "./hurl.ts";

describe("Hurl family AAA", () => {
  it("happy: paying the extra {r} still lets Hurl hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [hurlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(hurlRed, { modeIds: ["pay"] });
    game.advanceToDecision(Arakni, "entity-target");
    Arakni.chooseTargetPlayers(Dash);
    game.untilIdle();

    expectFabPlayer(Arakni).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Arakni, hurlRed).toBeIn("graveyard");
    expectFabCard(Arakni, hunterSKlaive).toBeIn("graveyard");
  });

  it("boundary: declining the extra {r} leaves the dagger and deals no extra damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [hurlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(hurlRed, { modeIds: ["decline"] });
    game.untilIdle();

    expectFabPlayer(Arakni).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Arakni, hunterSKlaive).toBeIn("weapon1");
  });

  it("timing: go again refunds AP at chain-link resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [hurlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(hurlRed, { modeIds: ["decline"] });
    expectFabPlayer(Arakni).toHaveAP(0);
    game.untilIdle();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Arakni).toHaveAP(1);
  });
});
