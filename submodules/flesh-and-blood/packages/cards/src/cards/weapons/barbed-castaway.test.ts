import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { barbedCastaway } from "./barbed-castaway.ts";

/**
 * Barbed Castaway (AZL002) — Ranger Weapon Bow (2H).
 *
 * Printed: "Once per Turn Instant - {r}: You may put an arrow card from your
 * hand face up into your arsenal.
 * Once per Turn Instant - {r}: You may turn a face down arrow in your arsenal
 * face up. If you do, put an aim counter on it."
 */

describe("Barbed Castaway (AZL002) AAA", () => {
  it("happy: Instant puts an arrow from hand face up into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        hand: [searingShotRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId: "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourcePutArrowHandFaceUpArsenal",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toBeFaceUp();
  });

  it("boundary: a non-arrow stays in hand and does not enter arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        hand: [snatchRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId: "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourcePutArrowHandFaceUpArsenal",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, snatchRed).toBeIn("hand");
  });

  it("happy: Instant turns a face-down arsenal arrow face up and puts an aim counter on it", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        hand: [],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId:
        "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toBeFaceUp();
    expectFabCard(Azalea, searingShotRed).toHaveCounters(1, "aim");
  });

  it("boundary: declining the Instant leaves the arrow face-down with no aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        hand: [],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId:
        "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter",
    });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toBeFaceDown();
    expectFabCard(Azalea, searingShotRed).toHaveCounters(0, "aim");
  });

  it("timing: the Instant that loads an arrow is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        hand: [searingShotRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId: "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourcePutArrowHandFaceUpArsenal",
    });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(
      Azalea.expectActivationRejected(
        barbedCastaway,
        "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourcePutArrowHandFaceUpArsenal",
      ).accepted,
    ).toBe(false);
  });
});
