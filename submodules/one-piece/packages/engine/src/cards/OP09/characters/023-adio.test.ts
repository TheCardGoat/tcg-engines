import { describe, test } from "vite-plus/test";
import { op09Adio023 } from "../../../../../cards/src/cards/characters/op09-023-adio.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-023 Adio", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Adio023);
  });
});
