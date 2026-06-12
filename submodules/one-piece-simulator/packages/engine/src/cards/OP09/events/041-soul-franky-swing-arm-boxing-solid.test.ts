import { describe, test } from "vite-plus/test";
import { op09SoulFrankySwingArmBoxingSolid041 } from "../../../../../cards/src/cards/OP09/events/041-soul-franky-swing-arm-boxing-solid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-041 Soul Franky Swing Arm Boxing Solid", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09SoulFrankySwingArmBoxingSolid041);
  });
});
