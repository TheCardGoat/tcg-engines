import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { butImMuchFaster } from "./195-but-im-much-faster";

describe("But I'm Much Faster", () => {
  it("gives the chosen character Alert and Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [butImMuchFaster],
      inkwell: butImMuchFaster.cost,
      play: [simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCardTo(butImMuchFaster, simbaProtectiveCub);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: simbaProtectiveCub, keyword: "Alert" });
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: simbaProtectiveCub,
      keyword: "Challenger",
      value: 2,
    });
  });
});
