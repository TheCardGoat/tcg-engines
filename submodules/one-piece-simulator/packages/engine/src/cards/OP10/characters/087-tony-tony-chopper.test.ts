import { describe, test } from "vite-plus/test";
import { op10TonyTonyChopper087 } from "../../../../../cards/src/cards/OP10/characters/087-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-087 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TonyTonyChopper087);
  });
});
