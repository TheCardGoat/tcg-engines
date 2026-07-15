import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "../../001/characters/046-jetsam-ursulas-spy";
import { youCanFly } from "../actions/133-you-can-fly";
import { sleepysFlute } from "./034-sleepys-flute";

describe("Sleepy's Flute", () => {
  it("gains 1 lore if you played a song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youCanFly],
      inkwell: youCanFly.cost,
      play: [sleepysFlute, jetsamUrsulasSpy],
    });

    expect(
      testEngine.asPlayerOne().playCard(youCanFly, {
        targets: [jetsamUrsulasSpy],
      }),
    ).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().activateAbility(sleepysFlute);

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not gain lore if you have not played a song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sleepysFlute],
    });

    const result = testEngine.asPlayerOne().activateAbility(sleepysFlute);

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });
});
