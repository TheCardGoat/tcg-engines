import { describe, test } from "vite-plus/test";
import { op10Issho023 } from "../../../../../cards/src/cards/OP10/characters/023-issho.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-023 Issho", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Issho023);
  });
});
