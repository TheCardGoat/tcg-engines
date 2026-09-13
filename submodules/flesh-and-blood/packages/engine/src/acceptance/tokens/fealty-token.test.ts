/**
 * CIN028 Fealty — Draconic Token Aura.
 *
 * Printed:
 *   a1: Instant - Destroy this: The next card you play this turn is Draconic.
 *       At the beginning of your end phase, if you haven't created a Fealty
 *       token or played a Draconic card this turn, destroy this.
 *
 * Public proof covers the floating grant, its one-shot/event scope, both
 * loyalty facts, controller phase ownership, and persisted continuation.
 */
import { describe, expect, it } from "vitest";

import { fealty } from "../../../../cards/src/cards/tokens/fealty.ts";
import { cindra } from "../../../../cards/src/cards/heroes/cindra.ts";
import { kunaiOfRetribution } from "../../../../cards/src/cards/weapons/kunai-of-retribution.ts";
import { pledgeFealtyRed } from "../../../../cards/src/cards/instants/pledge-fealty.ts";
import {
  createFabMatchContext,
  buildFabRulesView,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import {
  bravo,
  crackedBaubleYellow,
  dash,
  nimblismBlue,
  sigilOfSolaceRed,
  snatchRed,
  volticBoltRed,
} from "../../rules/fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function gameWithFealty(controller: "bravo" | "dash" = "bravo") {
  const bravoSetup = {
    hero: bravo,
    arena: controller === "bravo" ? [fealty] : [],
    hand: [nimblismBlue, sigilOfSolaceRed, snatchRed, crackedBaubleYellow],
    arsenal: [pledgeFealtyRed],
    deck: 8,
    actionPoints: 2,
    resourcePoints: 3,
  };
  const dashSetup = {
    hero: dash,
    arena: controller === "dash" ? [fealty] : [],
    hand: [nimblismBlue, sigilOfSolaceRed, snatchRed, crackedBaubleYellow],
    arsenal: [pledgeFealtyRed],
    deck: 8,
  };
  return FabTestEngine.start(bravoSetup, dashSetup, manual);
}

function evaluatedSupertypes(game: FabTestEngine, canonicalId: string): readonly string[] {
  const event = [...game.committedEvents()]
    .reverse()
    .find(
      (candidate) => candidate.name === "play" && candidate.data.object.canonicalId === canonicalId,
    );
  if (!event || event.name !== "play") throw new Error(`No play event for ${canonicalId}`);
  const record = game.getState().objects[event.data.object.instanceId];
  if (!record) throw new Error(`No live played object for ${canonicalId}`);
  const object = buildFabRulesView(game.getState()).object({
    instanceId: record.instanceId,
    incarnation: record.incarnation,
  });
  if (!object) throw new Error(`No evaluated object for ${canonicalId}`);
  return object.current.typeBox.supertypes;
}

function draconicGrant(game: FabTestEngine) {
  return game
    .getState()
    .continuousEffectInstances.find((instance) =>
      instance.atoms.some(
        (atom) =>
          atom.kind === "supertype" &&
          atom.property.kind === "supertype" &&
          atom.property.value === "Draconic",
      ),
    );
}

describe("Fealty token (CIN028)", () => {
  it("card loads in arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [fealty], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(fealty.canonicalId);
  });

  it("a1: an arbitrary next card played becomes Draconic through the canonical supertype query", () => {
    const game = gameWithFealty();
    const Bravo = game.as(bravo);

    Bravo.activate(fealty);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(fealty.canonicalId);

    Bravo.play(nimblismBlue);
    expect(evaluatedSupertypes(game, nimblismBlue.canonicalId)).toContain("Draconic");
  });

  it("a1 is one-shot and an activation cannot consume its play-only scope", () => {
    const game = gameWithFealty();
    const Bravo = game.as(bravo);

    Bravo.activate(fealty);
    game.helpers.resolveUntilIdle();
    // Hero activation is not a card play and must leave the applicator armed.
    Bravo.activate(bravo);
    game.helpers.resolveUntilIdle();
    expect(
      game
        .getState()
        .continuousEffectInstances.find((instance) =>
          instance.atoms.some(
            (atom) =>
              atom.kind === "supertype" &&
              atom.property.kind === "supertype" &&
              atom.property.value === "Draconic",
          ),
        )?.futureApplicability,
    ).toMatchObject({ events: ["play"], remaining: 1, latchedSubjects: [] });

    Bravo.play(sigilOfSolaceRed);
    expect(
      game
        .getState()
        .continuousEffectInstances.find((instance) =>
          instance.atoms.some(
            (atom) =>
              atom.kind === "supertype" &&
              atom.property.kind === "supertype" &&
              atom.property.value === "Draconic",
          ),
        )?.futureApplicability,
    ).toMatchObject({ remaining: 0, latchedSubjects: [expect.any(Object)] });
    expect(evaluatedSupertypes(game, sigilOfSolaceRed.canonicalId)).toContain("Draconic");
    game.helpers.resolveUntilIdle();
    Bravo.play(nimblismBlue);

    expect(evaluatedSupertypes(game, nimblismBlue.canonicalId)).not.toContain("Draconic");
  });

  it("a2 destroys an unsupported seeded token at its controller's end phase", () => {
    const game = gameWithFealty();
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(fealty.canonicalId);
  });

  it("a2 ignores the opponent's end phase and only checks its controller's history", () => {
    const game = gameWithFealty("dash");
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Dash.zone("arena")).toContain(fealty.canonicalId);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Dash.zone("arena")).not.toContain(fealty.canonicalId);
  });

  it("a2 retains Fealty when its controller played a Draconic card this turn", () => {
    const game = gameWithFealty();
    const Bravo = game.as(bravo);

    Bravo.play(pledgeFealtyRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toContain(fealty.canonicalId);
  });

  it("persists an armed next-play grant and its typed event scope across restore", () => {
    let game = gameWithFealty();
    let Bravo = game.as(bravo);
    Bravo.activate(fealty);
    game.helpers.resolveUntilIdle();

    const before = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(before),
        createFabMatchContext(before.cardDefinitions, before.publicCardIdentities),
      ),
    );
    Bravo = game.as(bravo);
    expect(
      game
        .getState()
        .continuousEffectInstances.find((instance) =>
          instance.atoms.some(
            (atom) =>
              atom.kind === "supertype" &&
              atom.property.kind === "supertype" &&
              atom.property.value === "Draconic",
          ),
        )?.futureApplicability,
    ).toMatchObject({ events: ["play"], remaining: 1, latchedSubjects: [] });
    Bravo.play(nimblismBlue);
    expect(
      game
        .getState()
        .continuousEffectInstances.find((instance) =>
          instance.atoms.some(
            (atom) =>
              atom.kind === "supertype" &&
              atom.property.kind === "supertype" &&
              atom.property.value === "Draconic",
          ),
        )?.futureApplicability,
    ).toMatchObject({ events: ["play"], remaining: 0, latchedSubjects: [expect.any(Object)] });
    // fromState uses its default auto-pass policy, so the card has resolved
    // into graveyard here and is a new object. The authoritative event-time
    // turn fact proves the restored applicator made the played card Draconic.
    expect(game.getState().players[Bravo.id]!.history.turn.playedDraconicCardThisTurn).toBe(true);
  });

  it("keeps a prospective Draconic grant transactional across snapshot and cancelled payment", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [fealty],
        hand: [volticBoltRed, crackedBaubleYellow],
        deck: 8,
        actionPoints: 2,
        resourcePoints: 0,
      },
      { hero: dash, deck: 8 },
      manual,
    );
    let Bravo = game.as(bravo);
    Bravo.activate(fealty);
    game.helpers.resolveUntilIdle();

    expect(() => Bravo.play(volticBoltRed)).toThrow("requires another persisted payment decision");
    expect(game.getState().decision).toMatchObject({ kind: "payment", amount: 2 });
    expect(draconicGrant(game)?.futureApplicability).toMatchObject({
      remaining: 1,
      latchedSubjects: [],
    });
    expect(game.getState().players[Bravo.id]!.history.turn.playedDraconicCardThisTurn).toBe(false);
    expect(game.committedEvents().filter((event) => event.name === "play")).toHaveLength(0);

    const suspended = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(suspended),
        createFabMatchContext(suspended.cardDefinitions, suspended.publicCardIdentities),
      ),
    );
    Bravo = game.as(bravo);
    const decision = game.getState().decision;
    if (!decision || decision.kind !== "payment") throw new Error("Expected restored payment.");
    const procedure = game.getState().rulesProcess?.procedure;
    const announcedInstanceId =
      procedure?.kind === "play-card" ? procedure.object.instanceId : null;
    if (!announcedInstanceId) throw new Error("Expected announced play object.");
    expect(() =>
      game.exec({
        move: "answer-decision",
        actorId: Bravo.id,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [announcedInstanceId] },
        },
      }),
    ).toThrow();
    expect(game.getState().decision).toEqual(decision);
    expect(draconicGrant(game)?.futureApplicability).toMatchObject({
      remaining: 1,
      latchedSubjects: [],
    });
    expect(game.getState().players[Bravo.id]!.history.turn.playedDraconicCardThisTurn).toBe(false);

    game.exec({
      move: "answer-decision",
      actorId: Bravo.id,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "cancel" },
      },
    });

    expect(game.getState().rulesProcess).toBeNull();
    expect(Bravo.zone("hand")).toContain(volticBoltRed.canonicalId);
    expect(draconicGrant(game)?.futureApplicability).toMatchObject({
      remaining: 1,
      latchedSubjects: [],
    });
    expect(game.getState().players[Bravo.id]!.history.turn.playedDraconicCardThisTurn).toBe(false);
    expect(game.committedEvents().filter((event) => event.name === "play")).toHaveLength(0);

    Bravo.play(volticBoltRed, { pitch: crackedBaubleYellow, target: game.as(dash) });
    expect(draconicGrant(game)?.futureApplicability).toMatchObject({ remaining: 0 });
    expect(game.getState().players[Bravo.id]!.history.turn.playedDraconicCardThisTurn).toBe(true);
  });

  it("tracks Fealty creation as its own typed loyalty fact", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        arena: [fealty],
        weapon1: [kunaiOfRetribution],
        hand: [nimblismBlue, sigilOfSolaceRed, snatchRed, crackedBaubleYellow],
        arsenal: [sigilOfSolaceRed],
        deck: 8,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, marked: true, deck: 8 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[Cindra.id]!.history.turn.createdFealtyTokenThisTurn).toBe(true);
    expect(game.getState().players[Cindra.id]!.history.turn.playedDraconicCardThisTurn).toBe(false);

    Cindra.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Cindra.zone("arena")).toContain(fealty.canonicalId);
  });
});
