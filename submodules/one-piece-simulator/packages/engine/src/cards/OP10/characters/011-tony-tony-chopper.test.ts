import { describe, test } from "vite-plus/test";
import { op10TonyTonyChopper011 } from "../../../../../cards/src/cards/OP10/characters/011-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-011 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TonyTonyChopper011);
  });
});
