import { describe, test } from "vite-plus/test";
import { op03Issho078 } from "../../../../../cards/src/cards/OP03/characters/078-issho.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-078 Issho", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Issho078);
  });
});
