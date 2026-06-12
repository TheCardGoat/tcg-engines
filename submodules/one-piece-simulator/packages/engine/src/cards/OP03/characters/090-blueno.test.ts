import { describe, test } from "vite-plus/test";
import { op03Blueno090 } from "../../../../../cards/src/cards/OP03/characters/090-blueno.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-090 Blueno", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Blueno090);
  });
});
