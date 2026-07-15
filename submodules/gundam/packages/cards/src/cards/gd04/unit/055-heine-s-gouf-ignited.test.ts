import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04HeineSGoufIgnited055 } from "./055-heine-s-gouf-ignited.ts";

describe("Heine's Gouf Ignited (GD04-055)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04HeineSGoufIgnited055));
});
