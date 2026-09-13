import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shatteringFlowtideRed } from "./shattering-flowtide.ts";

describe("Shattering Flowtide (AZS013) AAA", () => {
  it("happy: whenever this fragments, create a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [shatteringFlowtideRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(shatteringFlowtideRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 1);
  });

  it("boundary: without a qualifying block this does not fragment and creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [shatteringFlowtideRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(shatteringFlowtideRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 0);
    expectFabCard(Zyggy, shatteringFlowtideRed).toBeIn("graveyard");
  });
});
