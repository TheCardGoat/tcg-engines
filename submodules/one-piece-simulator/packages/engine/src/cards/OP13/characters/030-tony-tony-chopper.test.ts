import { describe, test } from "vite-plus/test";
import { op13TonyTonyChopper030 } from "../../../../../cards/src/cards/OP13/characters/030-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-030 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TonyTonyChopper030);
  });
});
