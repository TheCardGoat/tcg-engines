import { describe, test } from "vite-plus/test";
import { op07Shaka101 } from "../../../../../cards/src/cards/OP07/characters/101-shaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-101 Shaka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Shaka101);
  });
});
