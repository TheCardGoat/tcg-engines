import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { nimblismBlue } from "./nimblism.ts";
import { flexClawsRed } from "./flex-claws.ts";

/**
 * Flex Claws (DYN050) — Ninja Action - Attack. Red cost 1, 4{p}/2{d}. Go again.
 * When this hits, create a Crouching Tiger in your banished zone. You may play it this turn.
 */

describe("Flex Claws (DYN050) AAA", () => {
  it("happy: when this hits, create a Crouching Tiger in banished that may be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flexClawsRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(flexClawsRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(
      Bravo.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);

    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: a blocked miss does not create a Crouching Tiger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flexClawsRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(flexClawsRed);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expect(
      Bravo.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(0);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: the created tiger may not be played after the turn ends", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flexClawsRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(flexClawsRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Bravo.endTurn();
    game.as(dash).endTurn();

    expect(() => Bravo.attackWith(crouchingTiger, { from: "banished" })).toThrow();
    expectFabCard(Bravo, flexClawsRed).toBeIn("graveyard");
  });
});
