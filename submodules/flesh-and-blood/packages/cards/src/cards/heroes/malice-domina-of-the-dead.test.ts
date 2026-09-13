import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { restlessMagisterRed } from "../actions/restless-magister.ts";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { danseMacabre } from "../equipment/danse-macabre.ts";
import { snatchRed } from "../actions/snatch.ts";
import { jackBeQuickRed } from "../actions/jack-be-quick.ts";
import { mutualSacrificeRed } from "../actions/mutual-sacrifice.ts";
import { tentacularTollBlue } from "../actions/tentacular-toll.ts";
import { preserveTraditionBlue } from "../instants/preserve-tradition.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { maliceDominaOfTheDead } from "./malice-domina-of-the-dead.ts";

/**
 * Malice, Domina of the Dead (IAR053) AAA.
 *
 * Printed: "Action — {r}, {t}: Until end of turn, you may play target zombie
 * from your graveyard. Go again / Whenever a zombie you control dies, banish it
 * face-down and create a Corrupted Corpse in your banished Zone."
 *
 * Proves:
 * - With Vox Necropolis and Danse Macabre equipped, the graveyard Zombie attacks
 *   once, remains tapped, then Danse destroys it and triggers Malice at end phase
 * - The permission plays a graveyard Zombie; {r} paid, hero tapped, go again
 *   refunds the action point
 * - Without the permission a graveyard Zombie is not playable
 * - A dying Zombie you control is banished face-down and creates a Corrupted
 *   Corpse in the banished zone
 */

describe("Malice, Domina of the Dead (IAR053) AAA", () => {
  it("combo: Vox attacks once with Malice's graveyard Zombie, then Danse destroys it for Malice", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        legs: [danseMacabre],
        weapon1: [voxNecropolis],
        graveyard: [restlessMagisterRed],
        resourcePoints: 4,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();
    Malice.play(restlessMagisterRed, { from: "graveyard" });

    // CR 6.6.6b: both equipment trigger from the same enter-arena event. Put
    // Vox on the stack first so Danse resolves first and grants go again before
    // Vox makes the Zombie attack.
    const triggerOrder = game.advanceToDecision(Malice, "ordering");
    const zombieTrigger = triggerOrder.entries.find(
      (entry) => entry.source?.canonicalId === restlessMagisterRed.canonicalId,
    );
    const danseTrigger = triggerOrder.entries.find(
      (entry) => entry.source?.canonicalId === danseMacabre.canonicalId,
    );
    if (!zombieTrigger || !danseTrigger) {
      throw new Error("Expected simultaneous Zombie and Danse Macabre triggers.");
    }
    game.answerDecision(Malice.id, {
      kind: "ordering",
      orderedIds: [zombieTrigger.id, danseTrigger.id],
    });
    game.advanceUntil({ stopAt: "defend", optionals: "accept", ordering: "listed" });

    expectFabCard(Malice, maliceDominaOfTheDead).toBeTapped();
    expectFabCard(Malice, danseMacabre).toBeTapped();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("combatChain").toBeTapped();
    expectFabPlayer(Malice).toHaveResourceCount(1).toHaveAP(0);
    expectCombat(game).toBeOpen().toHaveKeyword("go-again");

    game.closeCombat({ ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena").toBeTapped();
    expectFabPlayer(Malice).toHaveResourceCount(1).toHaveAP(1);

    // Go again returns an action point, not the tap cost Vox paid for the
    // triggered attack. The Zombie cannot attack a second time while tapped.
    const secondAttack = Malice.expectActivationRejected(restlessMagisterRed);
    expect(secondAttack.errorCode).toBe("already_tapped");
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena").toBeTapped();
    expectFabPlayer(Malice).toHaveResourceCount(1).toHaveAP(1);

    Malice.endTurn();
    game.untilIdle({ ordering: "listed" });

    // Danse destroys the Zombie at the beginning of the end phase. Malice's
    // dies trigger then banishes it face-down and creates a Corrupted Corpse.
    expectFabCard(Malice, restlessMagisterRed).toBeIn("banished").toBeFaceDown();
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expectFabPlayer(Malice).toHaveLife(40);
  });

  it("happy: {r},{t} lets you play a graveyard Zombie this turn, then go again", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();

    // {r} paid, hero tapped, go again refunds the action point (2 − 1 + 1 = 2).
    expectFabPlayer(Malice).toHaveResourceCount(0);
    expectFabCard(Malice, maliceDominaOfTheDead).toBeTapped();
    expectFabPlayer(Malice).toHaveAP(2);

    Malice.play(restlessMagisterRed, { from: "graveyard" });
    game.untilIdle();

    // Playing the Zombie spent the refunded AP and moved it to the arena.
    expectFabPlayer(Malice).toHaveAP(1);
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena");
    expect(Malice.zone("graveyard")).not.toContain(restlessMagisterRed.canonicalId);
  });

  it("boundary: without the activation a graveyard Zombie is not playable", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    expectFabUnplayable(
      () => Malice.play(restlessMagisterRed, { from: "graveyard" }),
      /graveyard/i,
    );
    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard");
  });

  it("happy: a dying Zombie you control is banished face-down and creates a Corrupted Corpse", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: maliceDominaOfTheDead,
        arena: [restlessMagisterRed],
        hand: [],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(maliceDominaOfTheDead);
    const zombie = Malice.findCardInZone("arena", restlessMagisterRed);

    // Snatch (4{p}) kills the 3{h} Zombie during the damage step.
    Dash.playAttack(snatchRed, { target: zombie });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    // The dying-Zombie trigger is simultaneous with the attack's trigger;
    // the turn player orders them — Malice's trigger must still resolve.
    Dash.choose("player-2");
    game.untilIdle();

    expectFabCard(Malice, restlessMagisterRed).toBeIn("banished").toBeFaceDown();
    expect(Malice.zone("banished")).toContain(corruptedCorpse.canonicalId);
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expect(Malice.zone("graveyard")).not.toContain(restlessMagisterRed.canonicalId);

    game.helpers.expectLog("flesh-and-blood.dies", { cardName: "Restless Magister" });
    game.helpers.expectLog("flesh-and-blood.create", {
      playerId: Malice.id,
      cardName: "Corrupted Corpse",
    });
    const hiddenBanish = game
      .moveLogs()
      .flatMap((log) => log.public)
      .find(
        (message) =>
          message.key === "flesh-and-blood.banish.hidden.by-source" ||
          message.key === "flesh-and-blood.banish.hidden",
      );
    expect(hiddenBanish).toBeDefined();
    expect(hiddenBanish?.defaultMessage).not.toContain("Restless Magister");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish", { cardName: "Restless Magister" });
  });

  it("timing: still creates a Corrupted Corpse when the dead Zombie cannot be banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: maliceDominaOfTheDead,
        arena: [restlessMagisterRed],
        hand: [preserveTraditionBlue],
        resourcePoints: 1,
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(maliceDominaOfTheDead);
    const zombie = Malice.findCardInZone("arena", restlessMagisterRed);

    Dash.playAttack(snatchRed, { target: zombie });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");

    // Before Malice's dies trigger resolves, move its target out of the
    // graveyard. The failed banish must not prevent the following create step.
    Dash.pass();
    Malice.play(preserveTraditionBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: restlessMagisterRed.canonicalId });

    expect(Malice.zone("deck")[0]).toBe(restlessMagisterRed.canonicalId);
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expect(Malice.zone("banished")).not.toContain(restlessMagisterRed.canonicalId);
  });

  it("timing: the graveyard-play permission expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();
    expectFabCard(Malice, maliceDominaOfTheDead).toBeTapped();

    Malice.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();

    expectFabUnplayable(
      () => Malice.play(restlessMagisterRed, { from: "graveyard" }),
      /graveyard/i,
    );
    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard");
  });

  it("boundary: a face-down Zombie is not a legal target in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [{ card: restlessMagisterRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.expectActivationRejected(maliceDominaOfTheDead);
    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard").toBeFaceDown();
  });

  it("timing: the targeted Zombie cannot be played after it is turned face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        hand: [tentacularTollBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();
    Malice.play(tentacularTollBlue);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard").toBeFaceDown();
    expectFabUnplayable(
      () => Malice.play(restlessMagisterRed, { from: "graveyard" }),
      /graveyard|permission/i,
    );
  });

  it("ownership: a Zombie you control but do not own is banished to its owner's zone", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        hand: [jackBeQuickRed, mutualSacrificeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [restlessMagisterRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);
    const Dash = game.as(dash);

    Malice.playAttack(jackBeQuickRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expect(Malice.zone("arena")).toContain(restlessMagisterRed.canonicalId);

    Malice.playAttack(mutualSacrificeRed);
    game.closeCombat({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expectFabCard(Dash, restlessMagisterRed).toBeIn("banished").toBeFaceDown();
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expect(Malice.zone("banished")).not.toContain(restlessMagisterRed.canonicalId);
  });
});
