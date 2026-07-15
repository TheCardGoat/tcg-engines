import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04GundamExia064 } from "./064-gundam-exia.ts";

describe("Gundam Exia (GD04-064)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04GundamExia064));
});
