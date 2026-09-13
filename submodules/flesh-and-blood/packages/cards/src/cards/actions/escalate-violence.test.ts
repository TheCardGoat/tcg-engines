import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { escalateViolenceBlue } from "./escalate-violence.ts";

/**
 * Escalate Violence (SUP084) — When this attacks, if you control a Might token, create 3 more.
 */

describe("Escalate Violence (SUP084) AAA", () => {
  it("happy: attacking while controlling Might creates 3 more", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [escalateViolenceBlue],
        arena: [fabToken("might")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(escalateViolenceBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("might", 4);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: attacking with no Might creates none", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [escalateViolenceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(escalateViolenceBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("might", 0);
  });

  it("timing: the extra tokens exist at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [escalateViolenceBlue],
        arena: [fabToken("might")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(escalateViolenceBlue, { stopAt: "on-attack" });
    expectFabPlayer(Kayo).toHaveTokenCount("might", 4);
  });
});
