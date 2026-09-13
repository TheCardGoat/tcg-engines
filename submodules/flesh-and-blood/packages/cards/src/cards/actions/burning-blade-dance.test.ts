import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "@tcg/flesh-and-blood-engine/runtime";
import { FabTestEngine, expectFabPlayer, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zephyrNeedle } from "../weapons/zephyr-needle.ts";
import { quellingSlippers } from "../equipment/quelling-slippers.ts";
import { markOfTheHuntsman } from "../weapons/mark-of-the-huntsman.ts";
import { cindra } from "../heroes/cindra.ts";
import { kunaiOfRetribution } from "../weapons/kunai-of-retribution.ts";
import { burningBladeDanceRed } from "./burning-blade-dance.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Burning Blade Dance (CIN009) AAA", () => {
  it("after two Draconic links, may make a controlled dagger deal 1, count as dagger hitting, and destroy it", () => {
    let game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, legs: [quellingSlippers], life: 20, resourcePoints: 1, deck: 6 },
      manual,
    );
    let Cindra = game.as(cindra);
    let Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceToDecision(Dash, "option");
    Dash.chooseOptions();
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceToDecision(Dash, "option");
    Dash.chooseOptions();
    game.advanceCombatTo("resolution");
    Cindra.attackWith(burningBladeDanceRed);
    game.advanceToDecision(Dash, "option");
    Dash.chooseOptions();

    // CR 1.8.5 / 1.8.5e: the zero-or-one Dagger target is the optional
    // choice, and is declared before the triggered layer is added.
    expect(game.as(dash).life()).toBe(13);
    const targetDecision = game.advanceToDecision(Cindra, "entity-target");
    expect(targetDecision.continuation).toMatchObject({
      kind: "layer-target",
    });

    // Pending-trigger declaration and its candidate decision survive restore.
    const state = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(state),
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      ),
    );
    Cindra = game.as(cindra);
    Dash = game.as(dash);
    const restoredTarget = game.advanceToDecision(Cindra, "entity-target");
    expect(restoredTarget.continuation).toMatchObject({ kind: "layer-target" });
    Cindra.chooseTargets(Cindra.ref(kunaiOfRetribution));
    game.advanceToDecision(Dash, "option");
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      optionalOptions: "none",
      ordering: "listed",
    });

    expect(game.as(dash).life()).toBe(12);
    expect(Cindra.zone("weapon1")).not.toContain(kunaiOfRetribution.canonicalId);
    expect(Cindra.zone("graveyard")).toContain(kunaiOfRetribution.canonicalId);
  });

  it("does not offer the optional effect without a legal controlled Dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(burningBladeDanceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectWait(game).notToHaveDecision();
    expect(game.as(dash).life()).toBe(13);
    expect(Cindra.actionPoints()).toBe(1);
  });

  it("publishes the selected Dagger's hit before Burning Blade Dance destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [markOfTheHuntsman],
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(burningBladeDanceRed);
    game.advanceToDecision(Cindra, "entity-target");
    Cindra.chooseTargets(Cindra.ref(markOfTheHuntsman));
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    expect(game.as(dash).life()).toBe(12);
    expectFabPlayer(Dash).toBeMarked();
    expect(Cindra.zone("graveyard")).toContain(markOfTheHuntsman.canonicalId);
  });

  it("rejects an object that is not a current declared-target candidate", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        graveyard: [zephyrNeedle],
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(burningBladeDanceRed);
    game.advanceToDecision(Cindra, "entity-target");

    expect(() => Cindra.chooseTargets(Cindra.ref(zephyrNeedle))).toThrow(/legal target/i);
    expectWait(game).toHaveDecision("entity-target");
    expect(Cindra.zone("weapon1")).toContain(kunaiOfRetribution.canonicalId);
  });

  it("may decline the dagger-damage branch and preserve the dagger, the go again is still valid", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(burningBladeDanceRed);

    const decline = game.advanceToDecision(Cindra, "entity-target");
    expect(decline.continuation).toMatchObject({ kind: "layer-target" });
    Cindra.chooseTargets();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expect(game.as(dash).life()).toBe(13);
    expect(Cindra.zone("weapon1")).toContain(kunaiOfRetribution.canonicalId);
    expect(Cindra.actionPoints()).toBe(1);
  });
  it("before two Draconic links, has no conditional go again", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [
          burningBladeDanceRed,
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
        ],
        arsenal: [burningBladeDanceRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(burningBladeDanceRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(17);
    expect(Cindra.actionPoints()).toBe(0);
  });
});
