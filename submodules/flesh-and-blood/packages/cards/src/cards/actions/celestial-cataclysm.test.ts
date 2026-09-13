import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { celestialCataclysmYellow } from "./celestial-cataclysm.ts";

/**
 * Celestial Cataclysm, Yellow (MON062) — Light Attack Action.
 *
 * Printed: "As an additional cost to play this, banish 3 cards from your
 * soul.\nGo again" (cost 0, 7{p}, 3{d})
 */

describe("Celestial Cataclysm (MON062) AAA", () => {
  it("happy: banishing 3 soul cards pays the cost and the attack is printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [celestialCataclysmYellow],
        soul: [nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(celestialCataclysmYellow);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: empty soul cannot pay the additional soul-banish cost", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [celestialCataclysmYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expectFabUnplayable(
      () => Boltyn.attackWith(celestialCataclysmYellow),
      /soul-banish cost cannot be paid/,
    );
    expectFabCard(Boltyn, celestialCataclysmYellow).toBeIn("hand");
  });

  it("timing: Go again refunds the action point once the chain link resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [celestialCataclysmYellow],
        soul: [nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expectFabPlayer(Boltyn).toHaveAP(1);
    Boltyn.attackWith(celestialCataclysmYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(1);
  });
});
