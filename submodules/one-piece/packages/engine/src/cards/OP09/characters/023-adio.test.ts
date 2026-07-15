import { describe, test } from "vite-plus/test";
import { op09Adio023 } from "../../../../../cards/src/cards/OP09/characters/023-adio.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-023 Adio", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Adio023);
  });
});
