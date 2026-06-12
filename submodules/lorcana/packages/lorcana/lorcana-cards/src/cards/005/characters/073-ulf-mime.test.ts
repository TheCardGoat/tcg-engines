import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { ulfMime } from "./073-ulf-mime";
import { oneJumpAhead } from "../../001/actions/164-one-jump-ahead";

describe("Ulf - Mime", () => {
  it("has SILENT PERFORMANCE restriction ability", () => {
    expect(ulfMime.abilities).toHaveLength(1);
    const ability = ulfMime.abilities![0] as {
      type: string;
      name: string;
      effect?: {
        type: string;
        restriction: string;
        target: string;
      };
    };

    expect(ability.type).toBe("static");
    expect(ability.name).toBe("SILENT PERFORMANCE");
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-sing");
    expect(ability.effect?.target).toBe("SELF");
  });

  describe("SILENT PERFORMANCE - This character can't {E} to sing songs.", () => {
    it("cannot be used as a singer for a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [oneJumpAhead],
        play: [ulfMime],
      });

      // Ulf has cost 4, song costs 2 — he would normally qualify as a singer
      const result = testEngine.asPlayerOne().singSong(oneJumpAhead, ulfMime);

      expect(result.success).toBe(false);
    });

    it("does not appear as an available singer for songs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [oneJumpAhead],
        play: [ulfMime],
      });

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const singMove = moves.find((m) => m.moveId === "singCard");

      // The song should not be available to sing because Ulf can't sing
      expect(singMove).toBeUndefined();
    });
  });
});
