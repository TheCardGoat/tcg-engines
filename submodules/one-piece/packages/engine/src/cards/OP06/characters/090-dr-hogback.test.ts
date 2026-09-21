import { describe, test } from "vite-plus/test";
import { op06DrHogback090 } from "../../../../../cards/src/cards/characters/op06-090-dr-hogback.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-090 Dr. Hogback", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06DrHogback090);
  });
});
