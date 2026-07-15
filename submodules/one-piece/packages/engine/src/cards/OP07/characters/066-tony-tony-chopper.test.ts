import { describe, test } from "vite-plus/test";
import { op07TonyTonyChopper066 } from "../../../../../cards/src/cards/OP07/characters/066-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-066 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07TonyTonyChopper066);
  });
});
