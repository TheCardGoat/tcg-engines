import { describe, test } from "vite-plus/test";
import { op09SilversRayleigh005 } from "../../../../../cards/src/cards/OP09/characters/005-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-005 Silvers Rayleigh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09SilversRayleigh005);
  });
});
