import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "./001-ariel-on-human-legs";
import { oneJumpAhead } from "../actions/164-one-jump-ahead";

describe("Ariel - On Human Legs", () => {
  it("has VOICELESS restriction ability", () => {
    expect(arielOnHumanLegs.abilities).toHaveLength(1);
    const ability = arielOnHumanLegs.abilities![0] as {
      type: string;
      name: string;
      effect?: {
        type: string;
        restriction: string;
        target: string;
      };
    };

    expect(ability.type).toBe("static");
    expect(ability.name).toBe("VOICELESS");
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-sing");
    expect(ability.effect?.target).toBe("SELF");
  });

  describe("VOICELESS - This character can't {E} to sing songs.", () => {
    it("cannot be used as a singer for a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [oneJumpAhead],
        play: [arielOnHumanLegs],
      });

      // Ariel has cost 4, song costs 2 — she would normally qualify as a singer
      const result = testEngine.asPlayerOne().singSong(oneJumpAhead, arielOnHumanLegs);

      expect(result.success).toBe(false);
    });

    it("does not appear as an available singer for songs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [oneJumpAhead],
        play: [arielOnHumanLegs],
      });

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const singMove = moves.find((m) => m.moveId === "singCard");

      // The song should not be available to sing because Ariel can't sing
      expect(singMove).toBeUndefined();
    });
  });
});
