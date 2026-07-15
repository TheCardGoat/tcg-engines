/**
 * use-support — <Support> keyword activated ability (rule 13-1-3).
 *
 * <Support (N)> expands to the implicit activated ability:
 *   【Activate･Main】Rest this Unit → choose one other friendly unit;
 *   it gets AP+N during this turn.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

function rested(card: ReturnType<typeof createMockUnit>): TestCardEntry {
  return { card, exhausted: true };
}

describe("Main Phase — <Support> activated ability (rule 13-1-3)", () => {
  it("rests the source and grants AP+N this turn to the target", () => {
    const supporter = createMockUnit({
      ap: 1,
      hp: 3,
      keywordEffects: [{ keyword: "Support", value: 2 }],
    });
    const target = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create({ play: [supporter, target] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.useSupport(supporterId, targetId));

    // Source was rested.
    expect(engine.getG().exhausted[supporterId]).toBe(true);
    // Target has a this-turn AP+2 continuous effect.
    const buff = engine
      .getG()
      .continuousEffects.find(
        (e) =>
          e.targetId === targetId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.duration === "this-turn",
      );
    expect(buff).toBeDefined();
    expect(buff?.payload.kind === "stat-modifier" && buff.payload.modifier).toBe(2);
  });

  it("rejects targeting the support unit itself (13-1-3-1: 'other' friendly)", () => {
    const supporter = createMockUnit({
      ap: 1,
      hp: 3,
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const engine = GundamTestEngine.create({ play: [supporter] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.useSupport(supporterId, supporterId), "ILLEGAL_TARGET");
  });

  it("rejects when the source does not have <Support>", () => {
    const supporter = createMockUnit({ ap: 1, hp: 3 }); // no Support keyword
    const target = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create({ play: [supporter, target] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[1]!;

    expectFailure(p1.useSupport(supporterId, targetId), "NO_SUPPORT_KEYWORD");
  });

  it("rejects when the source is already rested", () => {
    const supporter = createMockUnit({
      ap: 1,
      hp: 3,
      keywordEffects: [{ keyword: "Support", value: 2 }],
    });
    const target = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create({ play: [rested(supporter), target] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[1]!;

    expectFailure(p1.useSupport(supporterId, targetId), "CARD_EXHAUSTED");
  });

  it("rejects targeting an enemy unit", () => {
    const supporter = createMockUnit({
      ap: 1,
      hp: 3,
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create({ play: [supporter] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.useSupport(supporterId, enemyId), "ILLEGAL_TARGET");
  });

  it("13-1-3-2: stacks additively when Support is gained from multiple sources", () => {
    // Base Support 1; add another Support keyword via cardMeta.grantedKeywords
    // (+1 per getKeywordValue).
    const supporter = createMockUnit({
      ap: 1,
      hp: 3,
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const target = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create({ play: [supporter, target] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[1]!;

    // Meta-granted Support keyword bumps the value by +1 (see getKeywordValue).
    const meta = engine.getState().ctx.zones.private.cardMeta[supporterId] ?? {};
    engine.getState().ctx.zones.private.cardMeta[supporterId] = {
      ...meta,
      grantedKeywords: [...((meta.grantedKeywords as string[]) ?? []), "Support"],
    };

    expectSuccess(p1.useSupport(supporterId, targetId));

    const buff = engine
      .getG()
      .continuousEffects.find(
        (e) =>
          e.targetId === targetId && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    // Base 1 + granted 1 = 2 (per getKeywordValue stacking rules).
    expect(buff?.payload.kind === "stat-modifier" && buff.payload.modifier).toBe(2);
  });
});
