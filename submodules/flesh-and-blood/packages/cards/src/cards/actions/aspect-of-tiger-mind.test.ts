import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { aspectOfTigerMindBlue } from "./aspect-of-tiger-mind.ts";

describe("Aspect of Tiger Mind (MST166) AAA", () => {
  it("happy: after a blue AAC last attack, this creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [brutalAssaultBlue, aspectOfTigerMindBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerMindBlue, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without a blue AAC last attack, no tiger is created", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [aspectOfTigerMindBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerMindBlue);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
  });
});
