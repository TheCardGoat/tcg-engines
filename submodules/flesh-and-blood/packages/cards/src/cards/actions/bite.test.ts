import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { biteRed } from "./bite.ts";

describe("Bite (HNT017) AAA", () => {
  it("happy: Bite hits for printed power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [biteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(biteRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Arakni, biteRed).toBeIn("graveyard");
    expectFabCard(Arakni, hunterSKlaive).toBeIn("weapon1");
  });

  it("boundary: a miss deals no combat damage and leaves the dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [biteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(biteRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Arakni, hunterSKlaive).toBeIn("weapon1");
  });

  it("timing: stealth is on the attack; an equipped dagger you control can ping and is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [biteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(biteRed);
    game.advanceToDecision(Arakni, "entity-target");
    Arakni.chooseTargets(hunterSKlaive);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Arakni, hunterSKlaive).toBeIn("graveyard");
  });

  it("timing: stealth is on the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [biteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(biteRed);
    expectCombat(game).toHaveKeyword("stealth");
    expectFabCard(Arakni, hunterSKlaive).toBeIn("weapon1");
  });
});
