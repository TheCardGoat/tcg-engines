import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { aspectOfTigerBodyRed } from "./aspect-of-tiger-body.ts";

describe("Aspect of Tiger Body (MST164) AAA", () => {
  it("happy: after a red AAC last attack, this creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [snatchRed, aspectOfTigerBodyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerBodyRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without a red AAC last attack, no tiger is created", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [aspectOfTigerBodyRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerBodyRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
  });

  it("timing: declining the optional leaves the tiger in banished unplayed", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [snatchRed, aspectOfTigerBodyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(aspectOfTigerBodyRed, { stopAt: "on-attack" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Katsu.zone("banished")).not.toContain("token:crouching-tiger");
    expectFabCard(Katsu, aspectOfTigerBodyRed).toBeIn("graveyard");
  });
});
