import { describe, expect, it } from "bun:test";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { mockCharacterCard } from "~/game-engine/engines/lorcana/src/testing/mockCards";
import { LorcanaTestEngine } from "../../testing/lorcana-test-engine";

const mockSingerCharacter: LorcanaCharacterCardDefinition = {
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
