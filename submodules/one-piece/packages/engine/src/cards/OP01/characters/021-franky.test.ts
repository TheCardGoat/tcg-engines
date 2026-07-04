import { describe, test } from "vite-plus/test";
import { op01Franky021 } from "../../../../../cards/src/cards/OP01/characters/021-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-021 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Franky021);
  });
});
