import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brothersInArmsRed } from "./brothers-in-arms.ts";

describe("Brothers in Arms family AAA", () => {
  it("happy: paying 1 resource grants +2 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [autumnSTouchBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: briar, hand: [brothersInArmsRed], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);
    Dash.attackWith(autumnSTouchBlue);
    game.advanceCombatTo("defend");
    Briar.defendWith(brothersInArmsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(19);
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });
  it("boundary: declining payment leaves printed defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [autumnSTouchBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: briar, hand: [brothersInArmsRed], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);
    Dash.attackWith(autumnSTouchBlue);
    game.advanceCombatTo("defend");
    Briar.defendWith(brothersInArmsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(17);
    expectFabPlayer(Briar).toHaveResourceCount(1);
  });
});
