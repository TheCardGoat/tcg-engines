import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  activationLimitUsageCount,
  effectiveActivationLimit,
  turnActivationUsageKey,
} from "../procedures/activate-ability/helpers.ts";
import { isFabMatchSnapshotV21, serializeFabMatchSnapshot } from "../snapshot/match-context.ts";
import { zenithBlade } from "../../../cards/src/cards/weapons/zenith-blade.ts";
import { halaBladesaintOfTheVow } from "../../../cards/src/cards/heroes/hala-bladesaint-of-the-vow.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { projectFabViewerState } from "../view.ts";

describe("CR 5.2.3 activation-limit composition", () => {
  it("uses the latest set-total limit, then sums independent additional grants", () => {
    const game = FabTestEngine.start(
      { hero: halaBladesaintOfTheVow, weapon1: [zenithBlade], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const state = game.getState();
    const controllerId = state.players[game.as(halaBladesaintOfTheVow).id]!.playerId;
    const weaponId = state.containers.zonesByPlayerId[controllerId]!.weapon1[0]!;
    const weapon = state.objects[weaponId]!;
    const ability = state.cardDefinitions[weapon.canonicalId]!.base.abilities!.find(
      (candidate) => candidate.id === "D8JcCHRDPNWCRtgCMgbtp:oncePerTurnActionResourceAttack",
    );
    if (!ability || ability.kind !== "activated") throw new Error("missing Zenith attack ability");
    const modifier = (
      modifierId: string,
      operation: "set-total" | "additional",
      count: number,
      generatedSequence: number,
    ) => ({
      modifierId,
      generatedSequence,
      controllerId,
      sourceRef: { instanceId: weapon.instanceId, incarnation: weapon.incarnation },
      attackSourceRef: { instanceId: weapon.instanceId, incarnation: weapon.incarnation },
      attackAbilityIds: [ability.id],
      operation,
      count,
      turnNumber: state.turnNumber,
    });
    state.activationLimitModifiers = [
      // Array order is deliberately unrelated to generation order. The later
      // set-total (sequence 2) is authoritative, then additions accumulate.
      modifier("set-2", "set-total", 2, 2),
      modifier("set-3", "set-total", 3, 1),
      modifier("plus-1", "additional", 1, 3),
      modifier("plus-2", "additional", 2, 4),
    ];

    expect(
      effectiveActivationLimit({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability,
      }),
    ).toBe(5);
    state.abilityLimitUsage[turnActivationUsageKey(state, controllerId, weaponId, ability.id)] = 1;
    expect(
      projectFabViewerState(state, { role: "spectator" }).attackActivationsByInstanceId?.[weaponId],
    ).toEqual({ controllerId, total: 5, used: 1, remaining: 4 });
    expect(
      effectiveActivationLimit({
        state,
        actorId: game.as(dash).id,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability,
      }),
    ).toBe(1);

    state.activationLimitModifiers = [
      modifier("set-2", "set-total", 2, 1),
      modifier("set-3", "set-total", 3, 2),
    ];
    expect(
      effectiveActivationLimit({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability,
      }),
    ).toBe(3);
    const { limit: _printedLimit, ...unprintedAttackAbility } = ability;
    state.activationLimitModifiers = [modifier("set-unprinted-2", "set-total", 2, 1)];
    expect(
      effectiveActivationLimit({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability: unprintedAttackAbility,
      }),
    ).toBe(2);
    state.activationLimitModifiers = [modifier("plus-unprinted-1", "additional", 1, 1)];
    // CR 5.2.1a: an ability with no printed LIMIT can be activated any number
    // of times, so an additional grant does not make that boundary finite.
    expect(
      effectiveActivationLimit({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability: unprintedAttackAbility,
      }),
    ).toBe(Number.POSITIVE_INFINITY);

    state.activationLimitModifiers = [
      {
        ...modifier("shared-total", "set-total", 2, 1),
        attackAbilityIds: [ability.id, "secondary-attack"],
      },
    ];
    state.abilityLimitUsage[turnActivationUsageKey(state, controllerId, weaponId, ability.id)] = 1;
    state.abilityLimitUsage[
      turnActivationUsageKey(state, controllerId, weaponId, "secondary-attack")
    ] = 1;
    expect(
      activationLimitUsageCount({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation,
        ability,
      }),
    ).toBe(2);
    // A leave/re-enter creates a new incarnation; old permissions do not
    // follow the physical instance into that new object identity.
    expect(
      effectiveActivationLimit({
        state,
        actorId: controllerId,
        instanceId: weaponId,
        incarnation: weapon.incarnation + 1,
        ability,
      }),
    ).toBe(1);

    const snapshot = serializeFabMatchSnapshot(state);
    expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        activationLimitModifiers: [
          { ...snapshot.activationLimitModifiers[0]!, attackAbilityIds: [] },
        ],
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        activationLimitModifiers: [
          {
            ...snapshot.activationLimitModifiers[0]!,
            attackSourceRef: {
              ...snapshot.activationLimitModifiers[0]!.attackSourceRef,
              incarnation: 999,
            },
          },
        ],
      }),
    ).toBe(false);
  });
});
