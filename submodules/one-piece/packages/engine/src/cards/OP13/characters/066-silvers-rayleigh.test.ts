import { describe, test } from "vite-plus/test";
import { op13SilversRayleigh066 } from "../../../../../cards/src/cards/OP13/characters/066-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-066 Silvers Rayleigh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SilversRayleigh066);
  });
});
