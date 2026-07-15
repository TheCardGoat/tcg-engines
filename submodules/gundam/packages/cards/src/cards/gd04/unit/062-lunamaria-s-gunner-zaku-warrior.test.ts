import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04LunamariaSGunnerZakuWarrior062 } from "./062-lunamaria-s-gunner-zaku-warrior.ts";

describe("Lunamaria's Gunner Zaku Warrior (GD04-062)", () => {
  it("deploys from hand to the battle area", () =>
    expectUnitCanDeploy(gd04LunamariaSGunnerZakuWarrior062));
});
