import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04GundamVirtue047 } from "./047-gundam-virtue.ts";

describe("Gundam Virtue (GD04-047)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04GundamVirtue047));
});
