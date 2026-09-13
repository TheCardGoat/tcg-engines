import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { ironsongDeterminationYellow as ironsongDetermination } from "./ironsong-determination.ts";

describe("Ironsong Determination (WTR122) AAA", () => {
  it("happy: target weapon's attack gets +1{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [ironsongDetermination],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongDetermination, { targetInstanceId: Dori.ref(dawnblade).instanceId });
    game.passBoth();
    Dori.target(dawnblade);
    Dori.activate(dawnblade);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("dominate");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a non-weapon attack action is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [ironsongDetermination, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongDetermination, { targetInstanceId: Dori.ref(dawnblade).instanceId });
    game.passBoth();
    Dori.target(dawnblade);
    Dori.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("dominate");
  });

  it("timing: only the targeted weapon's attacks get dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [ironsongDetermination],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const first = Dori.cardIn("weapon1", cintariSaber);
    const second = Dori.cardIn("weapon2", cintariSaber);

    Dori.play(ironsongDetermination, { targetInstanceId: first.instanceId });
    game.passBoth();
    while (game.pendingDecision()?.kind === "entity-target") Dori.target(first);

    Dori.must.activate(first);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("dominate");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dori.must.activate(second);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(2).notToHaveKeyword("dominate");
  });
});
