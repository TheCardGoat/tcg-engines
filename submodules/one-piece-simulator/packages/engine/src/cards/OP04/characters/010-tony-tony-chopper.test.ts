import { describe, test } from "vite-plus/test";
import { op04TonyTonyChopper010 } from "../../../../../cards/src/cards/OP04/characters/010-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-010 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04TonyTonyChopper010);
  });
});
