import { describe, test } from "vite-plus/test";
import { eb03MissValentineMikita047 } from "../../../../../cards/src/cards/EB03/characters/047-miss-valentine-mikita.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-047 Miss.Valentine(Mikita)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03MissValentineMikita047);
  });
});
