import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { imNeverNotByYourSide } from "./033-im-never-not-by-your-side";

const singerA = createMockCharacter({
  id: "im-never-not-by-your-side-singer-a",
  name: "Singer A",
  cost: 2,
});

const singerB = createMockCharacter({
  id: "im-never-not-by-your-side-singer-b",
  name: "Singer B",
  cost: 3,
});

const damagedAllyA = createMockCharacter({
  id: "im-never-not-by-your-side-damaged-ally-a",
  name: "Damaged Ally A",
  cost: 2,
  willpower: 6,
});

const damagedAllyB = createMockCharacter({
  id: "im-never-not-by-your-side-damaged-ally-b",
  name: "Damaged Ally B",
  cost: 2,
  willpower: 6,
});

describe("I'm Never Not by Your Side", () => {
  it("can be played via Sing Together 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [imNeverNotByYourSide],
      play: [singerA, singerB],
    });

    expect(
      testEngine.asPlayerOne().playSongTogether(imNeverNotByYourSide, [singerA, singerB]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(singerB)).toBe(true);
  });

  it("removes up to 4 total damage and gains lore for damage removed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [imNeverNotByYourSide],
      inkwell: imNeverNotByYourSide.cost,
      play: [damagedAllyA, damagedAllyB],
    });

    expect(testEngine.asServer().manualSetDamage(damagedAllyA, 3)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(damagedAllyB, 3)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(imNeverNotByYourSide)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [damagedAllyA, damagedAllyB],
        amount: 4,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(damagedAllyA).damage).toBe(0);
    expect(testEngine.asServer().getCard(damagedAllyB).damage).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(4);
  });
});
