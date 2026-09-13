import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "@tcg/flesh-and-blood-engine/runtime";
import { FabTestEngine, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow } from "./limpit-hop-a-long.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { thickHideHunterYellow } from "./thick-hide-hunter.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { quellingSlippers } from "../equipment/quelling-slippers.ts";
import { wailerHumperdinckYellow } from "./wailer-humperdinck.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { mercilessBattleaxe } from "../weapons/merciless-battleaxe.ts";
import { cleaveRed } from "./cleave.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Cleave (DYN071) AAA", () => {
  it("gives the next Axe attack +4 and may deal that exact hero-hit damage to another opposing ally", () => {
    // Arrange: the defender controls two distinguishable Allys so the optional
    // branch must select a real secondary target.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [limpitHopALongYellow, cintariSellsword],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act: Cleave applies to the next Axe, which hits the defending hero for 7.
    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.advanceCombatTo("defend");
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(true);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(Dash.ref(cintariSellsword));
    game.helpers.resolveUntilIdle();

    // Assert: the hero took the 7 hit damage and the chosen 2-life Ally took
    // the same 7, rather than total chain-link damage or damage to a random Ally.
    expect(Dash.life()).toBe(13);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("arena")).toContain(limpitHopALongYellow.canonicalId);
  });

  it("may decline the Ally-damage branch after the Axe hits", () => {
    // Arrange
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [cintariSellsword],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act
    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(false);
    game.helpers.resolveUntilIdle();

    // Assert: declining leaves the legal Ally untouched.
    expect(Dash.life()).toBe(13);
    expect(Dash.zone("arena")).toContain(cintariSellsword.canonicalId);
  });

  it("does not offer the branch when the Axe is fully defended", () => {
    // Arrange
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        head: [ironrotHelm],
        hand: [thickHideHunterYellow, snatchRed, snatchRed, nimblismBlue],
        arsenal: [snatchRed],
        arena: [cintariSellsword],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act
    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.advanceCombatTo("defend");
    // Defend Step declarations use ordinary cards from hand. Defense
    // reactions are played later in the Reaction Step and are not legal here.
    Dash.defendWith([thickHideHunterYellow, ironrotHelm]);
    game.helpers.resolveRestOfCombat();

    // Assert: no hit means no optional target or secondary damage.
    expect(Dash.life()).toBe(20);
    expect(Dash.zone("arena")).toContain(cintariSellsword.canonicalId);
    expectWait(game).notToHaveDecision();
  });

  it("does not offer the branch when a hero hit has no other Ally to choose", () => {
    // Arrange
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act
    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.helpers.resolveRestOfCombat();

    // Assert: the hit resolves normally, but with no opposing Ally the
    // optional branch has no legal acceptance path.
    expect(Dash.life()).toBe(13);
    expectWait(game).notToHaveDecision();
  });

  it("uses the exact post-prevention hit damage for the chosen Ally", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        legs: [quellingSlippers],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [wailerHumperdinckYellow, cintariSellsword],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const wailerId = Dash.ref(wailerHumperdinckYellow).instanceId;

    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.advanceToDecision(Dash, "option");
    const prevention = Dash.expectDecision("option");
    Dash.chooseOptions(prevention.options[0]!.id);
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(true);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(Dash.ref(wailerHumperdinckYellow));
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(14);
    expect(game.objectLife(wailerId)).toBe(1);
    expect(Dash.zone("arena")).toContain(wailerHumperdinckYellow.canonicalId);
  });

  it("uses hit-target LKI when the Axe hits an Ally and only offers another Ally of that hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [wailerHumperdinckYellow, cintariSellsword],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const hitAlly = Dash.ref(wailerHumperdinckYellow);

    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle();
    Bravo.exec({
      move: "activate",
      payload: {
        instanceId: Bravo.ref(mercilessBattleaxe).instanceId,
        target: hitAlly.instanceId,
      },
    });
    game.advanceToDecision(Bravo, "boolean");
    Bravo.accept();
    Bravo.target(cintariSellsword);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.life()).toBe(20);
    expect(Dash.zone("arena")).not.toContain(wailerHumperdinckYellow.canonicalId);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });

  it("restores the exact event provenance and legal relative target set from a snapshot", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [limpitHopALongYellow, cintariSellsword],
        life: 20,
        deck: 6,
      },
      manual,
    );
    let Bravo = game.as(bravo);

    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.activate(mercilessBattleaxe);
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(true);
    game.advanceToDecision(Bravo, "entity-target");

    const state = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(state),
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      ),
    );
    Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.chooseTargets(Dash.ref(cintariSellsword));
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(13);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("arena")).toContain(limpitHopALongYellow.canonicalId);
  });

  it("rejects a stale non-candidate without widening the hit-relative target set", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [cleaveRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        arena: [cintariSellsword],
        graveyard: [wailerHumperdinckYellow],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cleaveRed);
    game.helpers.resolveUntilIdle();
    Bravo.activate(mercilessBattleaxe);
    game.advanceToDecision(Bravo, "boolean");
    Bravo.accept();
    Bravo.target(cintariSellsword);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("graveyard")).toContain(wailerHumperdinckYellow.canonicalId);
  });
});
