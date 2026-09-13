import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { scarForAScarYellow } from "./scar-for-a-scar.ts";
import { aspectOfTigerSoulYellow } from "./aspect-of-tiger-soul.ts";

describe("Aspect of Tiger Soul (MST165) AAA", () => {
  it("happy: after a yellow AAC last attack, this creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [scarForAScarYellow, aspectOfTigerSoulYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerSoulYellow, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without a yellow AAC last attack, no tiger is created", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [aspectOfTigerSoulYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerSoulYellow);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
  });
});
