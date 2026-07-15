import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04Heindree031 } from "./031-heindree.ts";

describe("Heindree (GD04-031)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04Heindree031));
});
