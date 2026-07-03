import { describe, test } from "vite-plus/test";
import { op06DrHogback090 } from "../../../../../cards/src/cards/OP06/characters/090-dr-hogback.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-090 Dr. Hogback", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06DrHogback090);
  });
});
