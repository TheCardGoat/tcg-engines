import { describe, test } from "vite-plus/test";
import { op10Hajrudin050 } from "../../../../../cards/src/cards/OP10/characters/050-hajrudin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-050 Hajrudin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Hajrudin050);
  });
});
