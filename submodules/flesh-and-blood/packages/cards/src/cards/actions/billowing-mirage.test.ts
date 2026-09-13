import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ash } from "../tokens/ash.ts";
import { billowingMirageRed } from "./billowing-mirage.ts";

/**
 * Billowing Mirage (DRO012) — Draconic Illusionist AAC, cost 1, 3{p}, go again.
 *
 * Printed: "When you attack with Billowing Mirage, transform up to 1 ash you
 * control into an Aether Ashwing.\nGo again"
 */

describe("Billowing Mirage (DRO012) AAA", () => {
  it("happy: attacking with 1 Ash transforms it into an Aether Ashwing at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [billowingMirageRed],
        arena: [ash],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(billowingMirageRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", entityTargets: "maximum" });

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3).toHaveKeyword("go-again");
    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expect(Dromai.zone("arena")).not.toContain(ash.canonicalId);
  });

  it("boundary: with no Ash this still attacks and creates no Ashwing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [billowingMirageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(billowingMirageRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3).toHaveKeyword("go-again");
    expect(Dromai.zone("arena")).not.toContain("token:aether-ashwing");
  });

  it("timing: go again leaves 1 AP after combat close", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [billowingMirageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(billowingMirageRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    expectFabPlayer(Dromai).toHaveAP(0);

    game.closeCombat();

    expectFabPlayer(Dromai).toHaveAP(1);
    expectFabCard(Dromai, billowingMirageRed).toBeIn("graveyard");
  });
});
