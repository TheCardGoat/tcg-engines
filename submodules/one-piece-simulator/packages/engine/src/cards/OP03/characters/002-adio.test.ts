import { describe, test } from "vite-plus/test";
import { op03Adio002 } from "../../../../../cards/src/cards/OP03/characters/002-adio.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-002 Adio", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Adio002);
  });
});
