import { describe, test } from "vite-plus/test";
import { op01TonyTonyChopper015 } from "../../../../../cards/src/cards/characters/op01-015-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-015 Tony Tony.Chopper", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01TonyTonyChopper015);
  });
});
