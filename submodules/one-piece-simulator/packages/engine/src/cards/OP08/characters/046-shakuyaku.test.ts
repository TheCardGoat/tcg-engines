import { describe, test } from "vite-plus/test";
import { op08Shakuyaku046 } from "../../../../../cards/src/cards/OP08/characters/046-shakuyaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-046 Shakuyaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Shakuyaku046);
  });
});
