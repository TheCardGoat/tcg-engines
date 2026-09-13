import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { spellbladeStrikeYellow } from "./spellblade-strike.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { condemnToSlaughterRed } from "./condemn-to-slaughter.ts";
import { condemnToSlaughterBlue } from "./condemn-to-slaughter.ts";

const runechant = fabToken("runechant");

describe("Condemn to Slaughter (ROS127) AAA", () => {
  it("happy: the next Runeblade attack this turn gains +3{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [condemnToSlaughterRed, spellbladeStrikeYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(condemnToSlaughterRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabCard(Viserai, condemnToSlaughterRed).toBeIn("graveyard");

    Viserai.must.playAttack(spellbladeStrikeYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a Generic attack gets no +3{p} and does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [condemnToSlaughterRed, brutalAssaultBlue, spellbladeStrikeYellow],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(condemnToSlaughterRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Viserai.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Viserai.must.playAttack(spellbladeStrikeYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: destroying an aura you control makes the opponent destroy one they control", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [condemnToSlaughterRed],
        arena: [runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [runechant],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 1);

    Viserai.play(condemnToSlaughterRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
    expectFabCard(Viserai, condemnToSlaughterRed).toBeIn("graveyard");
  });

  it("happy: the next Runeblade attack this turn gains +1{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [condemnToSlaughterBlue, spellbladeStrikeYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(condemnToSlaughterBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabCard(Viserai, condemnToSlaughterBlue).toBeIn("graveyard");

    Viserai.must.playAttack(spellbladeStrikeYellow);
    game.advanceCombatTo("defend");
    // Spellblade Strike 3 + 1 = 4.
    expectCombat(game).toHaveAttackPower(4);
  });
});
