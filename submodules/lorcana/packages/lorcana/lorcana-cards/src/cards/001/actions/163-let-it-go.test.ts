import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../characters";
import { letItGo } from "./163-let-it-go";

describe("Let It Go", () => {
  it("puts chosen opposing character into their player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letItGo],
        inkwell: letItGo.cost,
      },
      {
        play: [simbaProtectiveCub],
        deck: 1,
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");

    const playResult = testEngine.asPlayerOne().playCard(letItGo, {
      targets: [simbaId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toEqual("inkwell");
    expect(testEngine.asServer().getCard(simbaId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[simbaId]?.publicFaceState,
    ).toBe("faceDown");
  });

  it("does not reveal the cards under a shift stack when the top card is inked (THE-1029 F-14)", () => {
    const baseCharacter = createMockCharacter({
      id: "let-it-go-shift-base",
      name: "Simba",
      cost: 2,
      strength: 1,
      willpower: 1,
    });
    const shiftedTop = createMockCharacter({
      id: "let-it-go-shift-top",
      name: "Simba",
      version: "Returned King",
      cost: 4,
      strength: 3,
      willpower: 4,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letItGo],
        inkwell: letItGo.cost,
      },
      {
        play: [{ card: shiftedTop, cardsUnder: [baseCharacter] }],
        deck: 1,
      },
    );
    const topId = testEngine.findCardInstanceId(shiftedTop, "play", "p2");
    const cardMetaBefore = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    const cardsUnder = (cardMetaBefore[topId] as { cardsUnder?: string[] } | undefined)?.cardsUnder;
    const baseId = (cardsUnder ?? [])[0] as string;
    expect(baseId).toBeTruthy();

    expect(
      testEngine.asPlayerOne().playCard(letItGo, { targets: [topId] }),
    ).toBeSuccessfulCommand();

    // Both cards moved to inkwell.
    expect(testEngine.asPlayerTwo().getCardZone(topId)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(baseId)).toBe("inkwell");

    // Only the chosen top card should be revealed to opponents; the base card
    // (previously face-down under the stack) must remain hidden.
    const activeReveals = testEngine.getAuthoritativeState().ctx.zones.reveals?.active ?? [];
    const revealedCardIds = new Set<string>(
      activeReveals.flatMap((window) => window.cardIDs as string[]),
    );
    expect(revealedCardIds.has(topId)).toBe(true);
    expect(revealedCardIds.has(baseId)).toBe(false);
  });
});
