import { describe, expect, it } from "bun:test";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import type { LorcanaAbility } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import { mockCharacterCard } from "~/game-engine/engines/lorcana/src/testing/mockCards";
import { LorcanaTestEngine } from "../../testing/lorcana-test-engine";

// TODO: Remove this once we have redefined card abilities
const mockSingerCharacter: LorcanitoCharacterCard & {
  abilities?: LorcanaAbility[];
} = {
  ...mockCharacterCard,
  id: "mock-singer-character",
  name: "Mock Singer Character",
  cost: hakunaMatata.cost - 2, // Not enough to play the song directly
  abilities: [singerAbility(hakunaMatata.cost)],
};

describe("Singer Ability", () => {
  it("should be able to play a card", async () => {
    const testEngine = new LorcanaTestEngine({
      play: [mockSingerCharacter],
      hand: [hakunaMatata],
    });

    const { singer, song } = testEngine.singSong({
      song: hakunaMatata,
      singer: mockSingerCharacter,
    });

    expect(singer.zone).toEqual("play");
    expect(singer.isExerted).toEqual(true);
    expect(song.zone).toEqual("discard");
  });
});
