import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bitingBreezeRed } from "./biting-breeze.ts";

/**
 * Biting Breeze (MST173) — Ninja Action - Attack. Red 0-cost 3{p}/2{d}. Go again.
 * When this hits, create a Crouching Tiger in your banished zone. You may play it this turn.
 */

describe("Biting Breeze (MST173) AAA", () => {
  it("happy: when this hits, create a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [bitingBreezeRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(bitingBreezeRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(
      Katsu.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: a blocked miss does not create a Crouching Tiger", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [bitingBreezeRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(bitingBreezeRed);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expect(
      Katsu.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(0);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: the created tiger may not be played after the turn ends", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [bitingBreezeRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(bitingBreezeRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Katsu.endTurn();
    game.as(dash).endTurn();

    expect(() => Katsu.attackWith(crouchingTiger, { from: "banished" })).toThrow();
    expectFabCard(Katsu, bitingBreezeRed).toBeIn("graveyard");
  });
});
