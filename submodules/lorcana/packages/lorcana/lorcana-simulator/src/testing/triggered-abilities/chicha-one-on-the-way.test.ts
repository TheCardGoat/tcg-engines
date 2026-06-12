import { describe, expect, it } from "bun:test";
import type { LorcanaProjectedBagEffect } from "@tcg/lorcana-engine";
import {
  CANONICAL_PLAYER_ONE,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleStrangeButSpecial } from "@tcg/lorcana-cards/cards/001";
import { chichaDedicatedMother } from "@tcg/lorcana-cards/cards/005";

const inkableA = createMockCharacter({
  id: "chicha-test-ink-a",
  name: "Inkable A",
  cost: 1,
  inkable: true,
});

const inkableB = createMockCharacter({
  id: "chicha-test-ink-b",
  name: "Inkable B",
  cost: 1,
  inkable: true,
});

function hasAbilityName(bagEffect: LorcanaProjectedBagEffect, abilityName: string): boolean {
  const payload = bagEffect.payload;
  if (typeof payload !== "object" || payload === null || !("abilityName" in payload)) {
    return false;
  }

  return payload.abilityName === abilityName;
}

function resolveAllBagEffects(
  player: ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>,
  opts: Parameters<ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>["resolveBag"]>[1],
): void {
  const maxIterations = player.getBagCount() + 20;
  for (let i = 0; i < maxIterations && player.getBagCount() > 0; i += 1) {
    const bagEffect = player.getBagEffects()[0];
    expect(bagEffect).toBeDefined();
    expect(player.resolveBag(bagEffect!.id, opts)).toBeSuccessfulCommand();
  }
  expect(player.getBagCount()).toBe(0);
}

describe("Chicha — Dedicated Mother — ONE ON THE WAY", () => {
  it("draws only when the second card is put into your inkwell the same turn (THE-963)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [chichaDedicatedMother, belleStrangeButSpecial],
        hand: [inkableA, inkableB],
        deck: 6,
      },
      { deck: 3 },
    );

    const p1 = testEngine.asPlayerOne();
    const handBefore = p1.getCardsInZone("hand", CANONICAL_PLAYER_ONE).count;

    expect(p1.ink(inkableA)).toBeSuccessfulCommand();
    resolveAllBagEffects(p1, { resolveOptional: true });
    const handAfterFirstInk = p1.getCardsInZone("hand", CANONICAL_PLAYER_ONE).count;
    expect(handAfterFirstInk).toBe(handBefore - 1);

    expect(p1.ink(inkableB)).toBeSuccessfulCommand();
    expect(p1.getBagCount()).toBeGreaterThanOrEqual(1);
    const oneOnTheWay = p1.getBagEffects().find((e) => hasAbilityName(e, "ONE ON THE WAY"));
    expect(oneOnTheWay).toBeDefined();

    const handBeforeSecondResolution = p1.getCardsInZone("hand", CANONICAL_PLAYER_ONE).count;
    expect(p1.resolveBag(oneOnTheWay!.id, { resolveOptional: true })).toBeSuccessfulCommand();
    resolveAllBagEffects(p1, { resolveOptional: true });

    expect(p1.getCardsInZone("hand", CANONICAL_PLAYER_ONE).count).toBe(
      handBeforeSecondResolution + 1,
    );
  });
});
