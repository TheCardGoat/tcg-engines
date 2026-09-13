import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { restBeforeBattleYellow } from "./rest-before-battle.ts";
import { annexationOfGrandeurYellow } from "./annexation-of-grandeur.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { frostHexBlue } from "./frost-hex.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { violentGustoRed } from "./violent-gusto.ts";

describe("Violent Gusto (IAR228) AAA", () => {
  it("happy: names and returns one opposing aura, then a hit returns every aura with that name", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [violentGustoRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [restBeforeBattleYellow, restBeforeBattleYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(violentGustoRed, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectFabPlayer(Dash).toHaveHandCount(1);
    game.closeCombat({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14).toHaveHandCount(2);
  });

  it("boundary: declining the attack trigger returns no auras, even when the attack hits", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [violentGustoRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [restBeforeBattleYellow, restBeforeBattleYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(violentGustoRed, { optionals: "decline" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14).toHaveHandCount(0);
  });

  it("ownership: a stolen opposing aura returns to its owner's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [annexationOfGrandeurYellow, brutalAssaultBlue, woundingBlowBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravoShowstopper,
        hand: [violentGustoRed, brutalAssaultBlue],
        arena: [frostHexBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Owner = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);

    Bravo.must.pitch(brutalAssaultBlue, woundingBlowBlue).playAttack(annexationOfGrandeurYellow);
    game.advanceCombatTo("defend");
    Owner.defendWith();
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("arena")).toContain(frostHexBlue.canonicalId);
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });
    expect(Bravo.zone("arena")).toContain(frostHexBlue.canonicalId);

    Owner.must.pitch(brutalAssaultBlue).playAttack(violentGustoRed, { target: Bravo });
    game.advanceUntil({ stopAt: "defend", optionals: "accept", entityTargets: "maximum" });

    expect(Bravo.zone("hand")).not.toContain(frostHexBlue.canonicalId);
    expect(Owner.zone("hand")).toContain(frostHexBlue.canonicalId);
  });
});
