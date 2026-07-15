import { describe, test } from "vite-plus/test";
import { op03Kuro021 } from "../../../../../cards/src/cards/OP03/leaders/021-kuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-021 Kuro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kuro021);
  });
});
