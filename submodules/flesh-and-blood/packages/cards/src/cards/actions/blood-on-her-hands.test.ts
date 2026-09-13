import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "./snatch.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { bloodOnHerHandsYellow } from "./blood-on-her-hands.ts";

/**
 * Blood on Her Hands Yellow (EVR055) — Kassai specialization Warrior Action.
 *
 * Additional cost: destroy any number of Copper you control.
 * Choose that many modes (repeat allowed); Errata #9 modes target a 1H weapon.
 */

describe("Blood on Her Hands (EVR055) AAA", () => {
  it("happy: destroy 1 Copper and choose +1{p} — Cintari Saber attacks for 3", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bloodOnHerHandsYellow],
        weapon1: [cintariSaber],
        arena: [fabToken("copper")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // Manual declaration: star-destroy (upTo) does not auto-select cost targets.
    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", bloodOnHerHandsYellow) },
    });
    const costTarget = game.pendingDecision();
    expect(costTarget?.kind).toBe("entity-target");
    if (costTarget?.kind !== "entity-target") throw new Error("expected copper cost target");
    const copperId = costTarget.candidates[0]!.instanceId;
    game.answerDecision(Kassai.id, {
      kind: "entity-target",
      instanceIds: [copperId],
    });
    // Mode 0 = +1{p} on target 1H weapon.
    const mode = game.pendingDecision();
    expect(mode?.kind).toBe("option");
    if (mode?.kind === "option") {
      Kassai.chooseOptions(mode.options[0]!.id);
    }
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Kassai.zone("arena").filter((id) => /copper/i.test(id))).toHaveLength(0);
    expectFabCard(Kassai, bloodOnHerHandsYellow).toBeIn("graveyard");

    Kassai.must.activate(cintariSaber);
    game.passBoth();
    // Cintari Saber base 2 +1 = 3.
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: destroy 0 Copper chooses 0 modes — saber stays at printed power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bloodOnHerHandsYellow],
        weapon1: [cintariSaber],
        arena: [fabToken("copper")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // upTo star-destroy defaults to 0 targets when min is 0 → 0 modes.
    Kassai.play(bloodOnHerHandsYellow);
    game.helpers.resolveUntilIdle();

    expect(Kassai.zone("arena").filter((id) => /copper/i.test(id))).toHaveLength(1);
    expectFabCard(Kassai, bloodOnHerHandsYellow).toBeIn("graveyard");

    Kassai.must.activate(cintariSaber);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("happy: destroy 2 Copper and choose +1{p} twice — Saber attacks for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bloodOnHerHandsYellow, snatchRed],
        weapon1: [cintariSaber],
        arena: [fabToken("copper"), fabToken("copper")],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", bloodOnHerHandsYellow) },
    });
    const costTarget = game.pendingDecision();
    expect(costTarget?.kind).toBe("entity-target");
    if (costTarget?.kind !== "entity-target") throw new Error("expected copper cost target");
    expect(costTarget.candidates).toHaveLength(2);
    game.answerDecision(Kassai.id, {
      kind: "entity-target",
      instanceIds: costTarget.candidates.map((candidate) => candidate.instanceId),
    });
    const plusPower = `${bloodOnHerHandsYellow.canonicalId}:asAdditionalCostPlayBloodHerHandsDestroyAny:target1hWeaponSAttacksGet1Turn`;
    for (let pick = 0; pick < 2; pick += 1) {
      const mode = game.pendingDecision();
      expect(mode?.kind).toBe("option");
      if (mode?.kind !== "option") throw new Error(`expected mode ${pick + 1} of 2`);
      expect(mode.min).toBe(1);
      expect(mode.max).toBe(1);
      Kassai.chooseOptions(plusPower);
    }
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Kassai.zone("arena").filter((id) => /copper/i.test(id))).toHaveLength(0);
    Kassai.must.activate(cintariSaber);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    Kassai.must.playAttack(snatchRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: go again mode applies to that saber's attacks, not the other 1H", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bloodOnHerHandsYellow],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        arena: [fabToken("copper")],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const firstSaber = Kassai.cardIn("weapon1", cintariSaber);
    const secondSaber = Kassai.cardIn("weapon2", cintariSaber);

    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", bloodOnHerHandsYellow) },
    });
    const costTarget = game.pendingDecision();
    if (costTarget?.kind !== "entity-target") throw new Error("expected copper cost");
    game.answerDecision(Kassai.id, {
      kind: "entity-target",
      instanceIds: costTarget.candidates.map((candidate) => candidate.instanceId),
    });
    Kassai.chooseOptions(
      `${bloodOnHerHandsYellow.canonicalId}:asAdditionalCostPlayBloodHerHandsDestroyAny:target1hWeaponSAttacksGetGoAgainTurn`,
    );
    game.passBoth();
    const targetGuard = createFabLoopGuard({ label: "EVR055: resolve entity-target" });
    while (game.pendingDecision()?.kind === "entity-target") {
      targetGuard.tick();
      game.answerDecision(Kassai.id, {
        kind: "entity-target",
        instanceIds: [firstSaber.instanceId],
      });
    }
    game.helpers.resolveUntilIdle();

    Kassai.must.activate(firstSaber);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    Kassai.must.activate(secondSaber);
    game.passBoth();
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: go again on the non-attack action refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bloodOnHerHandsYellow],
        weapon1: [cintariSaber],
        arena: [fabToken("copper")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(bloodOnHerHandsYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
