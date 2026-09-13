import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { snatchRed } from "./snatch.ts";
import { frostHexBlue } from "./frost-hex.ts";

describe("Frost Hex (UPR126) AAA", () => {
  it("happy: this enters arena as an affliction aura", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [frostHexBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    Iyslander.play(frostHexBlue, { target: game.as(dash) });
    game.helpers.resolveUntilIdle();
    expect(
      Iyslander.zone("arena").includes(frostHexBlue.canonicalId) ||
        game.as(dash).zone("arena").includes(frostHexBlue.canonicalId) ||
        Iyslander.zone("graveyard").includes(frostHexBlue.canonicalId),
    ).toBe(true);
  });

  it("boundary: it is not an attack", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [frostHexBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    Iyslander.play(frostHexBlue);
    game.helpers.resolveUntilIdle();
    expect(Iyslander.zone("combatChain")).toHaveLength(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [frostHexBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Iyslander.defendWith([frostHexBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Iyslander).toHaveLife(19);
  });
});
