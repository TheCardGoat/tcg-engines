import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04Borjarnon078 } from "./078-borjarnon.ts";

describe("Borjarnon (GD04-078)", () => {
  it("deploys from hand to the battle area", () => expectUnitCanDeploy(gd04Borjarnon078));
});
