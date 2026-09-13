import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { bravo, dash } from "./fixtures.ts";
import { markOfTheHuntsman } from "../../../cards/src/cards/weapons/mark-of-the-huntsman.ts";
import { fabActiveAttackIdentity } from "../game/combat.ts";
import { fabPlayerId } from "../game/identity.ts";
import { activationLimitKey } from "../procedures/activate-ability/helpers.ts";
import { reduceCombatEvent } from "./reducers/combat.ts";
import { snapshotObject } from "./snapshots.ts";
import { exactAttackBinding } from "./exact-attack.ts";

describe("persisted attack proxies", () => {
  it("gives a weapon attack a distinct proxy identity that survives snapshot restoration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [markOfTheHuntsman], actionPoints: 1, resourcePoints: 2, deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const weaponId = game.as(bravo).findCardInZone("weapon1", markOfTheHuntsman);
    game.as(bravo).exec({
      move: "activate",
      payload: {
        instanceId: weaponId,
        ability: "M9DL6cPLrKkmDhGpQL7Mg:oncePerTurnActionResourceResourceAttackGoAgain",
        target: game.as(dash).id,
      },
    });
    game.passBoth();

    const state = game.getState();
    const activeAttack = state.combat?.activeLink?.activeAttack;
    const proxyId = activeAttack?.kind === "proxy" ? activeAttack.proxyId : undefined;
    expect(proxyId).toMatch(/^attack-proxy:\d+$/);
    expect(proxyId).not.toBe(weaponId);
    expect(fabActiveAttackIdentity(activeAttack)).toBe(proxyId);
    if (!activeAttack) throw new Error("Expected an active weapon attack.");
    expect(
      exactAttackBinding(
        activeAttack,
        snapshotObject(state, weaponId, game.as(bravo).id, "weapon1"),
      ).attack,
    ).toEqual({
      instanceId: weaponId,
      incarnation: state.objects[weaponId]!.incarnation,
      attack: { kind: "proxy", proxyId },
    });
    expect(
      activationLimitKey(state, game.as(bravo).id, weaponId, "per-attack", "attack"),
    ).toContain(`attack-${proxyId}`);
    expect(state.attackProxies[proxyId!]).toMatchObject({
      id: proxyId,
      sourceId: weaponId,
      controllerId: game.as(bravo).id,
    });
    expect(state.combat?.activeLink?.attackTargetRef).toMatchObject({
      kind: "hero",
      playerId: game.as(dash).id,
    });

    const snapshot = serializeFabMatchSnapshot(state);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        attackProxies: {
          ...snapshot.attackProxies,
          [proxyId!]: { ...snapshot.attackProxies[proxyId!]!, sourceId: "missing-source" },
        },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        combat: {
          ...snapshot.combat!,
          activeLink: {
            ...snapshot.combat!.activeLink!,
            attackTargetRef: {
              objectId: "missing-target",
              controllerIdAtDeclaration: game.as(dash).id,
            },
          },
        },
      }),
    ).toBe(false);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.combat?.activeLink?.activeAttack).toMatchObject({
      kind: "proxy",
      proxyId,
      sourceObjectId: weaponId,
    });
    expect(restored.attackProxies[proxyId!]?.sourceId).toBe(weaponId);
    expect(restored.combat?.activeLink?.attackTargetRef).toEqual(
      state.combat?.activeLink?.attackTargetRef,
    );
  });

  it("retires the prior proxy when the same source creates a new attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [markOfTheHuntsman], actionPoints: 1, resourcePoints: 2, deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    const weaponId = attacker.findCardInZone("weapon1", markOfTheHuntsman);
    attacker.exec({
      move: "activate",
      payload: {
        instanceId: weaponId,
        ability: "M9DL6cPLrKkmDhGpQL7Mg:oncePerTurnActionResourceResourceAttackGoAgain",
        target: defender.id,
      },
    });
    game.passBoth();

    const state = game.getState();
    const firstAttack = state.combat!.activeLink!.activeAttack;
    if (firstAttack.kind !== "proxy") throw new Error("Expected a weapon attack proxy.");
    const weapon = snapshotObject(state, weaponId, attacker.id, "weapon1");
    const reduction = reduceCombatEvent(state, {
      name: "attack",
      processId: "process-999",
      cause: { kind: "rule", rule: "attack-proxy-lifecycle-test", controllerId: attacker.id },
      controllerId: attacker.id,
      source: weapon,
      affected: [weapon],
      bindings: {},
      data: {
        actorId: attacker.id,
        object: weapon,
        target: { kind: "hero", playerId: fabPlayerId(defender.id) },
        defendingPlayerId: defender.id,
      },
    });

    expect(reduction).not.toBeNull();
    const secondAttack = state.combat!.activeLink!.activeAttack;
    if (secondAttack.kind !== "proxy") throw new Error("Expected a replacement attack proxy.");
    expect(secondAttack.proxyId).not.toBe(firstAttack.proxyId);
    expect(exactAttackBinding(secondAttack, weapon).attack).not.toEqual(
      exactAttackBinding(firstAttack, weapon).attack,
    );
    expect(state.attackProxies[firstAttack.proxyId]).toBeUndefined();
    expect(state.attackProxies[secondAttack.proxyId]?.sourceId).toBe(weaponId);
    expect(state.combat!.closedLinks![0]!.activeAttack).toEqual(firstAttack);
    expect(() => serializeFabMatchSnapshot(state)).not.toThrow();
  });
});
