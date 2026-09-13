import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { glisteningSteelbladeYellow } from "../actions/glistening-steelblade.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { halaGoldenhelm } from "./hala-goldenhelm.ts";

/**
 * Hala Goldenhelm (DVR007) — Warrior Mentor.
 */

describe("Hala Goldenhelm (DVR007) AAA", () => {
  it("boundary: defense value is 3", () => {
    expect(halaGoldenhelm.base.numeric.defense).toBe(3);
  });

  it("timing: a sword hit grants go again on the sword and a lesson counter on Hala", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        arsenal: [{ card: halaGoldenhelm }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const mentorId = Dori.findCardInZone("arsenal", halaGoldenhelm);
    game.setObjectFaceDown(mentorId, false);

    Dori.must.activate(dawnbladeResplendent);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(Dori).toHaveAP(1);
    expectFabCard(Dori, halaGoldenhelm).toHaveCounters(1, "lesson");
  });

  it("happy: the second sword hit finds Glistening Steelblade face-up in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        arsenal: [{ card: halaGoldenhelm, state: { faceDown: false } }],
        deck: [glisteningSteelbladeYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activate(dawnbladeResplendent);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Dori, halaGoldenhelm).toHaveCounters(1, "lesson");

    Dori.endTurn();
    game.untilIdle({ optionals: "decline" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });
    seedResourcePoints(game, 1, Dori);

    Dori.activateAttack(dawnbladeResplendent, { entityTargets: "maximum" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Dori.cardsIn("banished", halaGoldenhelm)).toHaveLength(1);
    expectFabCard(Dori, glisteningSteelbladeYellow).toBeIn("arsenal").toBeFaceUp();
  });
});
