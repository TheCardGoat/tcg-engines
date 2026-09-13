import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { nimblismBlue } from "./nimblism.ts";
import { jackBeQuickRed } from "./jack-be-quick.ts";

describe("Jack Be Quick (SEA202) AAA", () => {
  it("happy: hitting a hero steals an ally they control for the rest of the action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [jackBeQuickRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [],
        arena: [cintariSellsword],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(jackBeQuickRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(17);
    expect(Dash.zone("arena")).toContain(cintariSellsword.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss does not steal the ally", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [jackBeQuickRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue],
        arena: [cintariSellsword],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(jackBeQuickRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expect(Bravo.zone("arena")).toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });

  it("timing: stolen ally returns when the action phase ends", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [jackBeQuickRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [],
        arena: [cintariSellsword],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(jackBeQuickRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expect(Dash.zone("arena")).toContain(cintariSellsword.canonicalId);

    Dash.endTurn();

    expect(Bravo.zone("arena")).toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });
});
