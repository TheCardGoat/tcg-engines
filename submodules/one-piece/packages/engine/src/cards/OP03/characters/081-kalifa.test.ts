import { describe, test } from "vite-plus/test";
import { op03Kalifa081 } from "../../../../../cards/src/cards/OP03/characters/081-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-081 Kalifa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kalifa081);
  });
});
