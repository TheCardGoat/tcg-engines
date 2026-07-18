import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op02JudgmentOfHell089,
  op03Gaimon043,
  op05Enel098,
  op13PortgasDAce002,
} from "@tcg/op-cards";

import { continueEffectDamage, resolvePrompt } from "../../src/battle.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("effect damage ordering", () => {
  test("resolves a Life trigger before continuing multi-damage", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        leaderCardId: op05Enel098,
        life: [op02JudgmentOfHell089, eb01Doma005],
      },
    );
    const state = engine.getState();
    const lifeCardId = engine.findCardInZone("north", "life", op02JudgmentOfHell089);
    const leaderId = engine.leader("north");

    continueEffectDamage(state, engine.leader("south"), "south", "north", 2);
    const prompt = state.promptQueue.find(
      (candidate) => candidate.resolutionContext?.intent === "lifeTrigger",
    );
    if (!prompt) {
      throw new Error("Expected effect damage to offer the revealed Life trigger.");
    }

    expect(
      resolvePrompt(state, {
        type: "resolvePrompt",
        seat: "north",
        promptId: prompt.id,
        optionId: "activate",
      }),
    ).toBe(true);
    expect(
      state.resolutionQueue.map((item) => ({
        kind: item.kind,
        sourceInstanceId: "sourceInstanceId" in item ? item.sourceInstanceId : null,
      })),
    ).toEqual([
      { kind: "effectBlock", sourceInstanceId: lifeCardId },
      { kind: "effectBlock", sourceInstanceId: leaderId },
      { kind: "effectDamageContinue", sourceInstanceId: engine.leader("south") },
    ]);
  });

  test("publishes when-you-take-damage reactions after effect damage", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13PortgasDAce002,
      life: [eb01Doma005],
      activeDon: 1,
    });
    const state = engine.getState();
    state.cards[engine.leader("south")]!.attachedDon = 1;

    continueEffectDamage(state, engine.leader("north"), "north", "south", 1);

    expect(
      state.resolutionQueue.map((item) => ({
        kind: item.kind,
        sourceInstanceId: "sourceInstanceId" in item ? item.sourceInstanceId : null,
      })),
    ).toContainEqual({
      kind: "effectBlock",
      sourceInstanceId: engine.leader("south"),
    });
  });

  test("publishes when-you-deal-damage reactions after effect damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Gaimon043, playedOnTurn: 0 }],
      },
      {
        life: [eb01Doma005],
      },
    );
    const state = engine.getState();
    const gaimonId = engine.findCardInZone("south", "character", op03Gaimon043);

    continueEffectDamage(state, engine.leader("south"), "south", "north", 1);

    expect(
      state.resolutionQueue.map((item) => ({
        kind: item.kind,
        sourceInstanceId: "sourceInstanceId" in item ? item.sourceInstanceId : null,
      })),
    ).toContainEqual({
      kind: "effectBlock",
      sourceInstanceId: gaimonId,
    });
  });
});
