import { describe, test } from "vite-plus/test";
import { op08TonyTonyChopper001 } from "../../../../../cards/src/cards/OP08/leaders/001-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-001 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TonyTonyChopper001);
  });
});
