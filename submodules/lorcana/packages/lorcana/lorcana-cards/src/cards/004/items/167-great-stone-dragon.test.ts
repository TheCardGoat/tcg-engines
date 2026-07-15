import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { greatStoneDragon } from "./167-great-stone-dragon";
import { tamatoaHappyAsAClam } from "../../007/characters/162-tamatoa-happy-as-a-clam";

const fallenSoldier = createMockCharacter({
  id: "great-stone-dragon-soldier",
  name: "Fallen Soldier",
  cost: 2,
});

describe("Great Stone Dragon", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [greatStoneDragon],
      inkwell: greatStoneDragon.cost,
    });

    expect(testEngine.asPlayerOne().playCard(greatStoneDragon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(greatStoneDragon)).toBe(true);
  });

  it("puts a chosen character card from your discard into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [greatStoneDragon],
      discard: [fallenSoldier],
    });

    const soldierId = testEngine.findCardInstanceId(fallenSoldier, "discard", "player_one");

    expect(
      testEngine.asPlayerOne().activateAbility(greatStoneDragon, {
        targets: [fallenSoldier],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(greatStoneDragon)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(fallenSoldier)).toBe("inkwell");
    expect(testEngine.getCardPublicFaceState(fallenSoldier, "inkwell")).toBe("faceDown");
    expect(testEngine.asServer().getCard(soldierId)?.exerted).toBe(true);
  });

  it("regression: enters play exerted when played for free via Tamatoa - Happy as a Clam's quest ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: tamatoaHappyAsAClam, isDrying: false }],
      hand: [greatStoneDragon],
      inkwell: 0,
      deck: 1,
    });

    // Quest with Tamatoa to trigger "I'M BEAUTIFUL, BABY!"
    expect(testEngine.asPlayerOne().quest(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional and play Great Stone Dragon for free
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tamatoaHappyAsAClam, {
        resolveOptional: true,
        targets: [greatStoneDragon],
      }),
    ).toBeSuccessfulCommand();

    // Great Stone Dragon should be in play AND exerted (ASLEEP ability)
    expect(testEngine.asPlayerOne().getCardZone(greatStoneDragon)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(greatStoneDragon)).toBe(true);
  });
});
