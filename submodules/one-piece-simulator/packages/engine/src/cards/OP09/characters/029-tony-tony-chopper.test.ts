import { describe, test } from "vite-plus/test";
import { op09TonyTonyChopper029 } from "../../../../../cards/src/cards/OP09/characters/029-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-029 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09TonyTonyChopper029);
  });
});
