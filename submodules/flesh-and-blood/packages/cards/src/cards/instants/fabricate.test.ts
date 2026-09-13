import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { protoBaseHead } from "../equipment/proto-base-head.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";
import { fabricateRed } from "./fabricate.ts";

describe("Fabricate (EVO146) AAA", () => {
  it("happy: choosing proto-equip and banish-an-Evo equips Proto Base Head and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricateRed, evoSteelSoulMemoryBlue],
        inventory: [protoBaseHead],
        deck: 6,
      },
      { hero: briar, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricateRed, { modeIndexes: [0, 3] });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, protoBaseHead).toBeIn("head");
    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeBanished();
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, fabricateRed).toBeIn("graveyard");
  });

  it("boundary: declining the optional Evo banish does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricateRed, evoSteelSoulMemoryBlue],
        inventory: [protoBaseHead],
        deck: 6,
      },
      { hero: briar, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricateRed, { modeIndexes: [0, 3] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, protoBaseHead).toBeIn("head");
    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
