import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { scarVengefulLion } from "../characters";
import { evilComesPrepared } from "./128-evil-comes-prepared";

describe("Evil Comes Prepared", () => {
  it("readies your chosen character and stops them from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [evilComesPrepared],
      inkwell: evilComesPrepared.cost,
      play: [{ card: simbaProtectiveCub, exerted: true }],
    });

    expect(testEngine.asPlayerOne().playCardTo(evilComesPrepared, simbaProtectiveCub).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("also gains 1 lore when the chosen character is a Villain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [evilComesPrepared],
      inkwell: evilComesPrepared.cost,
      play: [{ card: scarVengefulLion, exerted: true }],
    });

    expect(testEngine.asPlayerOne().playCardTo(evilComesPrepared, scarVengefulLion).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne()).toBeReady(scarVengefulLion);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: scarVengefulLion,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
