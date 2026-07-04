import { describe, it } from "vite-plus/test";
import { prm01RebeccaHavingAMoment } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Rebecca - Having a Moment", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(prm01RebeccaHavingAMoment);
  });
});
