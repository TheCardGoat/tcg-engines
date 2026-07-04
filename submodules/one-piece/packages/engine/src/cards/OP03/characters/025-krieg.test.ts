import { describe, test } from "vite-plus/test";
import { op03Krieg025 } from "../../../../../cards/src/cards/OP03/characters/025-krieg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-025 Krieg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Krieg025);
  });
});
