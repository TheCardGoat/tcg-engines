import { describe, expect, it } from "vitest";
import { fleshAndBloodDeckCardLibrary } from "../../../../cards/src/deck-library.ts";
import { playFabMatch as playFabMatchWithLibrary } from "./play-match.ts";

function playFabMatch(input: Omit<Parameters<typeof playFabMatchWithLibrary>[0], "cardLibrary">) {
  return playFabMatchWithLibrary({ ...input, cardLibrary: fleshAndBloodDeckCardLibrary });
}

describe("CC catalog seating for hero-profile", () => {
  it("seats a newly added coverage list without a hero-binding throw", { timeout: 60_000 }, () => {
    const played = playFabMatch({
      seed: "cc-seat-new-puffin",
      p1Strategy: "hero-profile",
      p2Strategy: "value-extract",
      p1Deck: "cc-coverage-puffin-hightail",
      p2Deck: "cc-guilherme-coutinho-rhinar",
      maxActions: 24,
      recordFrames: false,
    });
    expect(played.p1Strategy).toBe("hero-profile");
    expect(played.p1Deck).toBe("cc-coverage-puffin-hightail");
    expect(played.actionCount).toBeGreaterThan(0);
  });

  it(
    "seats an already-present tournament CC list without a hero-binding throw",
    { timeout: 60_000 },
    () => {
      const played = playFabMatch({
        seed: "cc-seat-existing-rhinar",
        p1Strategy: "hero-profile",
        p2Strategy: "value-extract",
        p1Deck: "cc-guilherme-coutinho-rhinar",
        p2Deck: "cc-edinburgh-1st-gravy-bones",
        maxActions: 24,
        recordFrames: false,
      });
      expect(played.p1Strategy).toBe("hero-profile");
      expect(played.p1Deck).toBe("cc-guilherme-coutinho-rhinar");
      expect(played.actionCount).toBeGreaterThan(0);
    },
  );

  it(
    "does not spend the converting budget cancel-looping Savage Feast",
    { timeout: 60_000 },
    () => {
      const played = playFabMatch({
        seed: "improve-puffin-1-1",
        p1Strategy: "hero-profile",
        p2Strategy: "value-extract",
        p1Deck: "cc-coverage-puffin-hightail",
        p2Deck: "cc-guilherme-coutinho-rhinar",
        maxActions: 80,
        recordFrames: true,
      });
      const cancels = played.frames.filter((frame) => frame.chosen.label === "Cancel play").length;
      expect(cancels).toBeLessThan(10);
    },
  );

  it(
    "converts a CC self-play instead of burning the cap on empty priority passes",
    { timeout: 120_000 },
    () => {
      const played = playFabMatch({
        seed: "improve-rhinar-1-7",
        p1Strategy: "hero-profile",
        p2Strategy: "value-extract",
        p1Deck: "cc-guilherme-coutinho-rhinar",
        p2Deck: "cc-edinburgh-1st-gravy-bones",
        maxActions: 400,
        recordFrames: false,
      });
      expect(played.termination).toBe("life");
      expect(played.winnerId).toBeTruthy();
      expect(played.actionCount).toBeLessThan(400);
    },
  );
});
