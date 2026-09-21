import { describe, test } from "vite-plus/test";
import { op04MissValentineMikita066 } from "../../../../../cards/src/cards/characters/op04-066-miss-valentine-mikita.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-066 Miss.Valentine(Mikita)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MissValentineMikita066);
  });
});
