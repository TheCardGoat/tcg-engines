import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crownOfProvidence } from "../equipment/crown-of-providence.ts";
import { fabricOfProvidenceRed } from "./fabric-of-providence.ts";

describe("Fabric of Providence (LSS013) AAA", () => {
  it("happy: equips Crown of Providence from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfProvidenceRed],
        inventory: [crownOfProvidence],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfProvidenceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, crownOfProvidence).toBeIn("head");
    expectFabCard(Dash, fabricOfProvidenceRed).toBeIn("arena");
  });

  it("boundary: with no Crown of Providence it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fabricOfProvidenceRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfProvidenceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, fabricOfProvidenceRed).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfProvidenceRed],
        inventory: [crownOfProvidence],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfProvidenceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
