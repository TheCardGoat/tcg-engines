import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { zephyrNeedle } from "../weapons/zephyr-needle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { flickKnives } from "./flick-knives.ts";

describe("Flick Knives (OUT139) AAA", () => {
  it("happy: unused dagger deals 1, hits, then is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [flickKnives],
        weapon1: [zephyrNeedle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.activate(flickKnives);
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Arakni.target(Dash);
    }
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Arakni, flickKnives).toBeIn("arms");
    expectFabCard(Arakni, zephyrNeedle).toBeIn("graveyard");
  });

  it("boundary: without an off-chain dagger the AR is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [flickKnives],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.expectActivationRejected(flickKnives);
    expectFabCard(Arakni, flickKnives).toBeIn("arms");
  });

  it("timing: the AR is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [flickKnives],
        weapon1: [zephyrNeedle],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.expectActivationRejected(flickKnives);
    expectFabCard(Arakni, flickKnives).toBeIn("arms");
  });

  it("cannot flick the active dagger even though its source stays in the weapon zone", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [flickKnives],
        weapon1: [zephyrNeedle],
        hand: [],
        deck: [],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(zephyrNeedle);
    game.toReaction("attacker");

    Arakni.expectActivationRejected(flickKnives);
    expectFabCard(Arakni, zephyrNeedle).toBeIn("weapon1");
    expectFabCard(Arakni, flickKnives).toBeIn("arms");
  });
});
