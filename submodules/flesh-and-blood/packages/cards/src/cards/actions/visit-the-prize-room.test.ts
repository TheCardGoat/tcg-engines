import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { olympia } from "../heroes/olympia.ts";
import { prizedGalea } from "../equipment/prized-galea.ts";
import { gold } from "../tokens/gold.ts";
import { visitThePrizeRoomBlue } from "./visit-the-prize-room.ts";

/**
 * Visit the Prize Room (AOL028) — Warrior Action, cost 1, Olympia
 * Specialization, go again.
 *
 * Printed: "Olympia Specialization\nYou may destroy a Gold you control. If you
 * do, equip a Prized Galea from your inventory.\nCreate a Vigor and a Courage
 * token. Go again"
 *
 * CR 1.8.3 / 1.8.5c: "destroy a Gold" is not a targeted effect. Declining the
 * may skips destroy and the "If you do" equip; vigor, courage, and go again
 * are later sequence steps and still resolve.
 */

describe("Visit the Prize Room (AOL028) AAA", () => {
  it("happy: destroying the Gold equips Prized Galea, and the tokens arrive", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arena: [gold],
        inventory: [prizedGalea],
        hand: [visitThePrizeRoomBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.play(visitThePrizeRoomBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expect(Olympia.zone("arena")).not.toContain(gold.canonicalId);
    expectFabCard(Olympia, prizedGalea).toBeIn("head");
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("courage", 1);
    expectFabPlayer(Olympia).toHaveAP(1); // printed go again
  });

  it("boundary: declining the Gold destroy leaves it in play and skips the equip", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arena: [gold],
        inventory: [prizedGalea],
        hand: [visitThePrizeRoomBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.play(visitThePrizeRoomBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Olympia, gold).toBeIn("arena");
    expect(Olympia.zone("inventory")).toContain(prizedGalea.canonicalId);
    expect(Olympia.zone("head")).toHaveLength(0);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("courage", 1);
    expectFabPlayer(Olympia).toHaveAP(1);
  });

  it("timing: with no Gold in play the equip never happens", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        inventory: [prizedGalea],
        hand: [visitThePrizeRoomBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.play(visitThePrizeRoomBlue);
    game.untilIdle({ optionals: "decline" });

    expect(Olympia.zone("inventory")).toContain(prizedGalea.canonicalId);
    expect(Olympia.zone("head")).toHaveLength(0);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("courage", 1);
  });
});
