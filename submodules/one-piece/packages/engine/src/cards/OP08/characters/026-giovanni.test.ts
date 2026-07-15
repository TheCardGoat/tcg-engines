import { describe, test } from "vite-plus/test";
import { op08Giovanni026 } from "../../../../../cards/src/cards/OP08/characters/026-giovanni.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-026 Giovanni", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Giovanni026);
  });
});
