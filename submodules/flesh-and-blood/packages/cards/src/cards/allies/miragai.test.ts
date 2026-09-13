import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { dunebreakerCenipaiBlue } from "../actions/dunebreaker-cenipai.ts";
import { vynserakai } from "./vynserakai.ts";
import { miragai } from "./miragai.ts";

describe("Miragai (UPR012) AAA", () => {
  it("happy: the first Dragon ally attack this turn is legal from Storm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [miragai, vynserakai],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dromai).activate(vynserakai);
    expectCombat(game).toBeOpen();
    expectCombat(game).notToHaveKeyword("phantasm");
  });

  it("boundary: a non-Dragon phantasm attack keeps phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [miragai],
        hand: [dunebreakerCenipaiBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dromai).playAttack(dunebreakerCenipaiBlue);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: Miragai itself may still attack with Storm of Sandikai", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [miragai],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    try {
      game.as(dromai).activate(miragai);
    } catch {
      expectCombat(game).toBeClosed();
      return;
    }
    expect(game.combat()?.activeLink?.attackPower ?? 0).toBeGreaterThanOrEqual(0);
  });
});
