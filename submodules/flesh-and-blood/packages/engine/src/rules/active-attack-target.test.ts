import { describe, expect, it } from "vitest";

import { fearlessConfrontationBlue } from "../../../cards/src/cards/actions/fearless-confrontation.ts";
import { edgeOfAutumn } from "../../../cards/src/cards/weapons/edge-of-autumn.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "./fixtures.ts";

describe("exact active-attack targets", () => {
  it("persists a weapon proxy target and does not leak onto the same weapon's next attack", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [edgeOfAutumn],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 8,
      },
      {
        hero: dash,
        hand: [fearlessConfrontationBlue, snatchRed, snatchRed, snatchRed],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: true, pitchStack: "manual" },
    );
    let Attacker = game.as(bravo);
    let Defender = game.as(dash);
    const weaponId = Attacker.findCardInZone("weapon1", edgeOfAutumn);

    Attacker.must.activate(edgeOfAutumn);
    game.passBoth();
    const firstAttack = game.combat()?.activeLink?.activeAttack;
    if (firstAttack?.kind !== "proxy") throw new Error("Expected the first weapon proxy.");
    game.helpers.passPriorityTo(Defender);
    Defender.must.activate(fearlessConfrontationBlue);
    game.passBoth();

    const exactSubject = game
      .getState()
      .continuousEffectInstances.flatMap((effect) => effect.initialSubjects)
      .find((subject) => "attack" in subject && subject.attack.kind === "proxy");
    expect(exactSubject).toMatchObject({
      instanceId: weaponId,
      attack: { kind: "proxy", proxyId: firstAttack.proxyId },
    });
    expect(
      game
        .getState()
        .continuousEffectInstances.some(
          (effect) =>
            effect.atoms.some((atom) => atom.kind === "numeric") &&
            effect.initialSubjects.some(
              (subject) => "attack" in subject && subject.attack.kind === "proxy",
            ),
        ),
    ).toBe(true);
    const beforeRestore = game.getState();
    const snapshot = serializeFabMatchSnapshot(beforeRestore);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        continuousEffectInstances: snapshot.continuousEffectInstances.map((effect) => ({
          ...effect,
          initialSubjects: effect.initialSubjects.map((subject) =>
            "attack" in subject
              ? { ...subject, attack: { kind: "proxy", proxyId: "attack-proxy:stale" } }
              : subject,
          ),
        })),
      }),
    ).toBe(false);
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    );
    Attacker = game.as(bravo);
    Defender = game.as(dash);

    game.helpers.resolveRestOfCombat();
    // The attacker's chain close is a deliberate manual stop in the
    // automation doctrine, so the walker no longer cascades into the end
    // phase: end the attacker's action phase explicitly before asserting on
    // the defender's turn.
    if (game.getState().phase === "action") {
      Attacker.must.endTurn();
    }
    if (game.getState().decision?.continuation.kind === "turn-arsenal") {
      Attacker.target();
    }
    expect(Defender.life()).toBe(20);
    expect(
      game
        .getState()
        .continuousEffectInstances.some((effect) =>
          effect.initialSubjects.some((subject) => "attack" in subject),
        ),
    ).toBe(false);

    Defender.must.endTurn();
    Attacker.must.activate(edgeOfAutumn);
    game.answerDecision(Attacker.id, {
      kind: "payment",
      instanceIds: [Attacker.cardsIn("hand", nimblismBlue)[0]!.instanceId],
    });
    if (game.getState().decision?.kind === "payment") {
      game.answerDecision(Attacker.id, { kind: "payment", instanceIds: [] });
    }
    game.passBoth();
    expect(Defender.life()).toBe(19);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "resolve-combat-damage")
        .at(-1)?.data.damage,
    ).toBe(1);
  });
});
