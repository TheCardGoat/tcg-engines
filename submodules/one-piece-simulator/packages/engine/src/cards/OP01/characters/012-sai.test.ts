import { describe, test } from "vite-plus/test";
import { op01Sai012 } from "../../../../../cards/src/cards/OP01/characters/012-sai.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-012 Sai", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Sai012);
  });
});
