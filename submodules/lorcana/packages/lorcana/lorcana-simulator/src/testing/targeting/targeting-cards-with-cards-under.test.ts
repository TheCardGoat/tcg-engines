import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";

/**
 * TARGETING CARDS WITH CARDS-UNDER
 * Tests for abilities that require targets to have cards under, or effects that target based on cards-under status
 */
describe("Targeting Cards With Cards-Under", () => {
  describe("TARGET-001 to TARGET-004: Scrooge - On the Right Track (FABULOUS WEALTH)", () => {
    it.todo("TARGET-001: On play: chosen character WITH card under gets +1 L", () => {});

    it.todo("TARGET-002: Must target character with cards-under >= 1", () => {});

    it.todo("TARGET-003: Can target opponent's character if it has cards under", () => {});

    it.todo("TARGET-004: Buff lasts this turn", () => {});
  });

  describe("Targeting Mechanics", () => {
    it.todo("Can only target cards that meet cards-under requirement", () => {});

    it.todo("Cannot target cards without cards under when they are required", () => {});

    it.todo("Targeting validation works at resolution time (not at activation time)", () => {});

    it.todo("Multiple valid targets should all be available for selection", () => {});
  });
});
