import { describe, test } from "vite-plus/test";
import { op07Coribou025 } from "../../../../../cards/src/cards/OP07/characters/025-coribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-025 Coribou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Coribou025);
  });
});
