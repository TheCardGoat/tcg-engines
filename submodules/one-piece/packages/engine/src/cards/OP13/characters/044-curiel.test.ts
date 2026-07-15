import { describe, test } from "vite-plus/test";
import { op13Curiel044 } from "../../../../../cards/src/cards/OP13/characters/044-curiel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-044 Curiel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Curiel044);
  });
});
