import { describe, test } from "vite-plus/test";
import { op08Giovanni026 } from "../../../../../cards/src/cards/characters/op08-026-giovanni.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-026 Giovanni", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Giovanni026);
  });
});
