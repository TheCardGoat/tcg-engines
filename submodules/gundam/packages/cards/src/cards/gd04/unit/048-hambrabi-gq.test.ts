import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04HambrabiGq048 } from "./048-hambrabi-gq.ts";

describe("Hambrabi (GQ) (GD04-048)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04HambrabiGq048));
});
