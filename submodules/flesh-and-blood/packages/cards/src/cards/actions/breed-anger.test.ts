import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { katsu } from "../heroes/katsu.ts";
import { breedAngerRed } from "./breed-anger.ts";

describe("Breed Anger (MST176) AAA", () => {
  it("happy: after Crouching Tiger, this creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, breedAngerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(breedAngerRed, { stopAt: "on-attack" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Katsu.zone("banished")).toContain("token:crouching-tiger");
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without Crouching Tiger last, no tiger is created", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [breedAngerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(breedAngerRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
  });
});
