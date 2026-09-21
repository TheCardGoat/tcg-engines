import { describe, test } from "vite-plus/test";
import { op07TonyTonyChopper103 } from "../../../../../cards/src/cards/characters/op07-103-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-103 Tony Tony.Chopper", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07TonyTonyChopper103);
  });
});
