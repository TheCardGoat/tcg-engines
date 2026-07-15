import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04Agrissa079 } from "./079-agrissa.ts";

describe("Agrissa (GD04-079)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04Agrissa079));
});
