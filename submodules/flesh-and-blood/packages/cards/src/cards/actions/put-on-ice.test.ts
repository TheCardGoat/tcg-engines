import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { limpitHopALongYellow } from "./limpit-hop-a-long.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { snatchRed } from "./snatch.ts";
import { putOnIceRed } from "./put-on-ice.ts";

/**
 * Put on Ice, Red (PEN234) — Ice Action, cost 1, pitch 1, 2{d}.
 * Printed: "Freeze up to 3 target allies until the start of your next turn.
 * If this was played from arsenal, draw a card. Go again"
 *
 * Freeze is CR 8.5.34 (cannot activate). Go again is CR 8.3.5a on the
 * non-attack layer. Arsenal play is not an Arrow (no bow).
 * Up-to on-stack targeting is declared via begin-play then `.target`
 * because `play()` auto-answers up-to as 0.
 */

function declarePutOnIce(
  caster: ReturnType<FabTestEngine["as"]>,
  from: "hand" | "arsenal" = "hand",
): void {
  caster.exec({
    move: "begin-play",
    payload: {
      instanceId: caster.findCardInZone(from, putOnIceRed),
      ...(from === "arsenal" ? { from: "arsenal" as const } : {}),
    },
  });
}

describe("Put on Ice (PEN234) AAA", () => {
  it("happy: freezes up to 3 allies; frozen allies cannot activate; go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [putOnIceRed],
        arena: [oystenHeartOfGoldYellow, barnacleYellow, limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    declarePutOnIce(Iyslander);
    Iyslander.target(oystenHeartOfGoldYellow, barnacleYellow, limpitHopALongYellow);
    game.untilIdle();

    expectFabCard(Iyslander, putOnIceRed).toBeIn("graveyard");
    expectFabPlayer(Iyslander).toHaveAP(1);
    expect(() => Iyslander.activate(oystenHeartOfGoldYellow)).toThrow(
      /frozen and cannot be activated/,
    );
    expect(() => Iyslander.activate(barnacleYellow)).toThrow(/frozen and cannot be activated/);
    expect(() => Iyslander.activate(limpitHopALongYellow)).toThrow(
      /frozen and cannot be activated/,
    );
  });

  it("happy: played from arsenal, draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [],
        arsenal: [putOnIceRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    declarePutOnIce(Iyslander, "arsenal");
    Iyslander.target(oystenHeartOfGoldYellow);
    game.untilIdle();

    expectFabCard(Iyslander, snatchRed).toBeIn("hand");
    expect(Iyslander.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: played from hand does not draw; freezing 1 of 2 leaves the other unfrozen", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [putOnIceRed],
        arena: [oystenHeartOfGoldYellow, barnacleYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    declarePutOnIce(Iyslander);
    Iyslander.target(oystenHeartOfGoldYellow);
    game.untilIdle();

    expect(Iyslander.zone("deck")).toContain(snatchRed.canonicalId);
    expect(() => Iyslander.activate(oystenHeartOfGoldYellow)).toThrow(
      /frozen and cannot be activated/,
    );
    Iyslander.activate(barnacleYellow);
    expect(game.combat()?.open).toBe(true);
  });

  it("happy: opponent's ally is a legal freeze target (printed 'target allies')", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [putOnIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [oystenHeartOfGoldYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    declarePutOnIce(Iyslander);
    Iyslander.target(Dash.ref(oystenHeartOfGoldYellow));
    game.untilIdle();
    Iyslander.endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(() => Dash.activate(oystenHeartOfGoldYellow)).toThrow(/frozen and cannot be activated/);
  });

  it("timing: freeze lasts until the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [putOnIceRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    declarePutOnIce(Iyslander);
    Iyslander.target(oystenHeartOfGoldYellow);
    game.untilIdle();
    expect(() => Iyslander.activate(oystenHeartOfGoldYellow)).toThrow(
      /frozen and cannot be activated/,
    );

    Iyslander.endTurn();
    game.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    Iyslander.activate(oystenHeartOfGoldYellow);
    expect(game.combat()?.open).toBe(true);
  });
});
