import { describe, expect, it } from "vitest";
import type { FabAttackTarget, FabAttackTargetRef } from "../game/combat.ts";
import type { FabActivatedLayer, FabCardResolutionStep, FabTriggeredLayer } from "./layers.ts";
import type { FabActivateProcedure, FabPendingTrigger, FabPlayCardProcedure } from "./process.ts";
import type { FabObjectRef } from "./continuous/ir.ts";
import type { FabTargetMap, MutableFabTargetMap } from "./targets.ts";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;

type ObjectAttackTarget = Exclude<FabAttackTarget, { readonly kind: "hero" }>;
type PersistedObjectAttackTarget = Extract<FabAttackTargetRef, { readonly kind: "object" }>;

type ExactTargetAssertions = readonly [
  Equal<FabPlayCardProcedure["declaredTargets"], MutableFabTargetMap>,
  Equal<FabActivateProcedure["declaredTargets"], MutableFabTargetMap>,
  Equal<FabPendingTrigger["declaredTargets"], FabTargetMap>,
  Equal<FabCardResolutionStep["targets"], FabTargetMap>,
  Equal<FabActivatedLayer["targets"], FabTargetMap>,
  Equal<FabTriggeredLayer["targets"], FabTargetMap>,
  Equal<ObjectAttackTarget["ref"], FabObjectRef>,
  Equal<PersistedObjectAttackTarget["ref"], FabObjectRef>,
];

describe("exact target type structure", () => {
  it("requires exact object refs at every persisted target boundary", () => {
    const assertions: ExactTargetAssertions = [true, true, true, true, true, true, true, true];
    expect(assertions.every(Boolean)).toBe(true);
  });
});
