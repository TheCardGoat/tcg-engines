import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hadronColliderRed } from "./hadron-collider.ts";

describe("Hadron Collider: RED (EVO090) AAA", () => {
  it("happy: boosting an attack destroys this and the attack gets +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: hadronColliderRed, state: { steamCounters: 4 } }],
        hand: [zeroToSixtyRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { boost: true, stopAt: "defend" });

    expectFabCard(Teklo, hadronColliderRed).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: an unboosted attack does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: hadronColliderRed, state: { steamCounters: 4 } }],
        hand: [zeroToSixtyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { stopAt: "defend" });

    expectFabCard(Teklo, hadronColliderRed).toBeIn("arena");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: hadronColliderRed, state: { steamCounters: 4 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, hadronColliderRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, hadronColliderRed).toBeIn("arena");
  });
});
