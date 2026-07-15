import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04Hipheavy076 } from "./076-hipheavy.ts";

describe("Hipheavy (GD04-076)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04Hipheavy076));
});
