import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ash } from "../tokens/ash.ts";
import { rakeTheEmbersRed } from "./rake-the-embers.ts";

/**
 * Rake the Embers (DRO011) — Draconic Illusionist Action, cost 1, 2{d}, go again.
 *
 * Printed: "Create an Ash token, then transform up to 3 ash you control into
 * Aether Ashwings.\nGo again"
 */

describe("Rake the Embers (DRO011) AAA", () => {
  it("happy: creates an Ash then transforms up to 3 ashes into Aether Ashwings", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [rakeTheEmbersRed],
        arena: [ash, ash],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(rakeTheEmbersRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expectFabCard(Dromai, rakeTheEmbersRed).toBeIn("graveyard");
  });

  it("boundary: taking the minimum transform leaves the created Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [rakeTheEmbersRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(rakeTheEmbersRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Dromai.zone("arena")).toContain("token:ash");
    expect(Dromai.zone("arena")).not.toContain("token:aether-ashwing");
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [rakeTheEmbersRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(rakeTheEmbersRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Dromai).toHaveAP(1);
  });
});
