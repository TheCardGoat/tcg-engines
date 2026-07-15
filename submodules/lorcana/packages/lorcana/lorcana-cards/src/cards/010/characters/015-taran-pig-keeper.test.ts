import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import type { LorcanaProjectedBagEffect } from "@tcg/lorcana-engine";
import { taranPigKeeper } from "./015-taran-pig-keeper";
import { henWenPropheticPig } from "./138-hen-wen-prophetic-pig";

const henWenOtherVersion = createMockCharacter({
  id: "taran-hen-wen-mock",
  name: "Hen Wen",
  cost: 2,
});

const otherCharacterInDiscard = createMockCharacter({
  id: "taran-other-char",
  name: "Some Other Character",
  cost: 2,
});

function hasAbilityName(bagEffect: LorcanaProjectedBagEffect, abilityName: string): boolean {
  const payload = bagEffect.payload;
  if (typeof payload !== "object" || payload === null || !("abilityName" in payload)) {
    return false;
  }

  return payload.abilityName === abilityName;
}

function resolveRemainingBagEffects(
  player: ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>,
  opts: Parameters<ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>["resolveBag"]>[1],
): void {
  const maxIterations = player.getBagCount() + 10;

  for (let iteration = 0; iteration < maxIterations && player.getBagCount() > 0; iteration += 1) {
    const bagEffect = player.getBagEffects()[0];
    expect(bagEffect).toBeDefined();
    expect(player.resolveBag(bagEffect!.id, opts)).toBeSuccessfulCommand();
  }

  expect(player.getBagCount()).toBe(0);
}

describe("Taran - Pig Keeper", () => {
  it("has Support keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: taranPigKeeper }],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().hasKeyword(taranPigKeeper, "Support")).toBe(true);
  });

  describe("FOLLOW THE PIG", () => {
    it("returns a Hen Wen character from discard to hand when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: taranPigKeeper }],
        discard: [{ card: henWenPropheticPig }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(taranPigKeeper)).toBeSuccessfulCommand();

      // Questing with Support creates bag entries: Support trigger + FOLLOW THE PIG trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      const followThePig = testEngine
        .asPlayerOne()
        .getBagEffects()
        .find((bagEffect) => hasAbilityName(bagEffect, "FOLLOW THE PIG"));
      expect(followThePig).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolveBag(followThePig!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const henWenId = testEngine.findCardInstanceId(henWenPropheticPig, "discard");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [henWenId] }),
      ).toBeSuccessfulCommand();

      resolveRemainingBagEffects(testEngine.asPlayerOne(), { resolveOptional: false });

      expect(testEngine.asPlayerOne().getCardZone(henWenPropheticPig)).toBe("hand");
    });

    it("is optional — can decline to return Hen Wen from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: taranPigKeeper }],
        discard: [{ card: henWenPropheticPig }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(taranPigKeeper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      const followThePig = testEngine
        .asPlayerOne()
        .getBagEffects()
        .find((bagEffect) => hasAbilityName(bagEffect, "FOLLOW THE PIG"));
      expect(followThePig).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolveBag(followThePig!.id, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      resolveRemainingBagEffects(testEngine.asPlayerOne(), { resolveOptional: false });

      expect(testEngine.asPlayerOne().getCardZone(henWenPropheticPig)).toBe("discard");
    });

    it("does not produce a FOLLOW THE PIG trigger when no Hen Wen is in discard", () => {
      const testEngineWith = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: taranPigKeeper }],
        discard: [{ card: otherCharacterInDiscard }],
        deck: 1,
      });

      const testEngineWithout = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: taranPigKeeper }],
        deck: 1,
      });

      expect(testEngineWith.asPlayerOne().quest(taranPigKeeper)).toBeSuccessfulCommand();
      expect(testEngineWithout.asPlayerOne().quest(taranPigKeeper)).toBeSuccessfulCommand();

      // When no Hen Wen is in discard, bag count should be the same as with no discard at all
      const bagCountWith = testEngineWith.asPlayerOne().getBagCount();
      const bagCountWithout = testEngineWithout.asPlayerOne().getBagCount();
      expect(bagCountWith).toBe(bagCountWithout);
    });

    it("also works with a different Hen Wen card version (same name)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: taranPigKeeper }],
        discard: [{ card: henWenOtherVersion }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(taranPigKeeper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      const followThePig = testEngine
        .asPlayerOne()
        .getBagEffects()
        .find((bagEffect) => hasAbilityName(bagEffect, "FOLLOW THE PIG"));
      expect(followThePig).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolveBag(followThePig!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const henWenId = testEngine.findCardInstanceId(henWenOtherVersion, "discard");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [henWenId] }),
      ).toBeSuccessfulCommand();

      resolveRemainingBagEffects(testEngine.asPlayerOne(), { resolveOptional: false });

      expect(testEngine.asPlayerOne().getCardZone(henWenOtherVersion)).toBe("hand");
    });
  });
});
