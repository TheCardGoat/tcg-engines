/**
 * `selfIsRested` / `selfIsActive` EffectCondition variants.
 *
 * Card text like "While this Unit is rested, ..." (Core Fighter
 * GD04-013, Freedom Gundam GD03-070, Tieren Taozi GD03-074) keys on
 * the unit's own rest state. These conditions read the same exhausted
 * map as `ctx.isRested` / `ctx.isActive`, rebound through
 * `selfIdentityCardId` so pilot-resident effects evaluate against
 * the paired unit (rule 3-3-9-1).
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import { evaluateCondition } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  buildTargetResolutionContext,
  createMockUnit,
} from "../index.ts";

function setup() {
  const unit = createMockUnit({ ap: 2, hp: 3 });
  const engine = GundamTestEngine.create({ play: [unit] });
  const runtime = engine.getRuntime();
  const framework = runtime.getFrameworkReadAPI();
  const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
  const buildCtx = () =>
    buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, { sourceCardId: unitId });
  return { engine, unitId, buildCtx };
}

describe("EffectCondition.selfIsRested", () => {
  it("returns true when the source card is rested", () => {
    const { engine, unitId, buildCtx } = setup();
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.exhausted[unitId as CardInstanceId] = true;
    });
    expect(evaluateCondition({ type: "selfIsRested" }, buildCtx())).toBe(true);
  });

  it("returns false when the source card is active", () => {
    const { buildCtx } = setup();
    expect(evaluateCondition({ type: "selfIsRested" }, buildCtx())).toBe(false);
  });
});

describe("EffectCondition.selfIsActive", () => {
  it("returns true when the source card is active (default state)", () => {
    const { buildCtx } = setup();
    expect(evaluateCondition({ type: "selfIsActive" }, buildCtx())).toBe(true);
  });

  it("returns false when the source card is rested", () => {
    const { engine, unitId, buildCtx } = setup();
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.exhausted[unitId as CardInstanceId] = true;
    });
    expect(evaluateCondition({ type: "selfIsActive" }, buildCtx())).toBe(false);
  });
});
