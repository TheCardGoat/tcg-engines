import { describe, test } from "vite-plus/test";
import { op11TonyTonyChopper053 } from "../../../../../cards/src/cards/OP11/characters/053-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-053 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11TonyTonyChopper053);
  });
});
