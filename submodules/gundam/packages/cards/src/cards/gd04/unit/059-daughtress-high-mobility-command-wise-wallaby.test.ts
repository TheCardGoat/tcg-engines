import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04DaughtressHighMobilityCommandWiseWallaby059 } from "./059-daughtress-high-mobility-command-wise-wallaby.ts";

describe("Daughtress High Mobility Command Wise Wallaby (GD04-059)", () => {
  it("deploys from hand to the battle area", () =>
    expectUnitCanDeploy(gd04DaughtressHighMobilityCommandWiseWallaby059));
});
