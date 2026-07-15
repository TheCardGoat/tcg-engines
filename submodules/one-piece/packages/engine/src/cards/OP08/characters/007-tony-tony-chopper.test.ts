import { describe, test } from "vite-plus/test";
import { op08TonyTonyChopper007 } from "../../../../../cards/src/cards/OP08/characters/007-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-007 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TonyTonyChopper007);
  });
});
