import { describe, test } from "vite-plus/test";
import { op10Kyros046 } from "../../../../../cards/src/cards/OP10/characters/046-kyros.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-046 Kyros", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Kyros046);
  });
});
