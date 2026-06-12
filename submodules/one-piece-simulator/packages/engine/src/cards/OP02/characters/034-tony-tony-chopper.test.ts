import { describe, test } from "vite-plus/test";
import { op02TonyTonyChopper034 } from "../../../../../cards/src/cards/OP02/characters/034-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-034 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02TonyTonyChopper034);
  });
});
