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
import { skitteringSandsRed } from "./skittering-sands.ts";

/**
 * Skittering Sands (DRO013) — Draconic Illusionist Action, cost 0, 2{d}, go again.
 *
 * Printed: "Transform target ash you control into an Aether Ashwing. It gains
 * +3{p} until end of turn.\nGo again"
 *
 * The +3{p} step targets `self` (this Action), not the transformed Ashwing.
 * Pin the Ashwing staying at printed 1{p}.
 */

describe("Skittering Sands (DRO013) AAA", () => {
  it("happy: transforms target Ash into an Aether Ashwing (pin: +3{p} does not land on the Ashwing)", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [skitteringSandsRed],
        arena: [ash],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(skitteringSandsRed, {
      targetInstanceId: Dromai.cardIn("arena", ash).instanceId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expect(Dromai.zone("arena")).not.toContain(ash.canonicalId);
    expectFabCard(Dromai, skitteringSandsRed).toBeIn("graveyard");
  });

  it("boundary: with no Ash under your control this still resolves and creates no Ashwing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [skitteringSandsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(skitteringSandsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dromai, skitteringSandsRed).toBeIn("graveyard");
    expect(Dromai.zone("arena")).not.toContain("token:aether-ashwing");
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [skitteringSandsRed],
        arena: [ash],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(skitteringSandsRed, {
      targetInstanceId: Dromai.cardIn("arena", ash).instanceId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dromai).toHaveAP(1);
  });
});
