import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04SchuzrumGalluss040 } from "./040-schuzrum-galluss.ts";

describe("Schuzrum-Galluss (GD04-040)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04SchuzrumGalluss040));
});
